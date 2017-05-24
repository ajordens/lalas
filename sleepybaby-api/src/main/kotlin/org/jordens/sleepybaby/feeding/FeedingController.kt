/*
 * Copyright 2017 Adam Jordens
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.jordens.sleepybaby.feeding

import org.jordens.sleepybaby.Feeding
import org.jordens.sleepybaby.FeedingDataSource
import org.jordens.sleepybaby.GenericResponse
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*
import java.text.SimpleDateFormat
import java.util.*
import java.util.concurrent.TimeUnit

/**
 * Feeding information grouped by day (`/byDay`) or by time (`/byFeeding`).
 *
 * Helps answer questions like:
 * - how much milk is consumed in an entire day (day over day)
 * - how much milk is consumed in a particular feeding (day over day)
 * - overall milk consumption vs time spent nursing
 */
@RestController
@RequestMapping(value = "/api/feedings")
class FeedingController @Autowired constructor(val feedingDataSource: FeedingDataSource) {
  val logger = LoggerFactory.getLogger(FeedingController::class.java)
  val dateFormatter = SimpleDateFormat("HH:mm")

  @GetMapping
  fun all(): GenericResponse = GenericResponse.ok(mapOf(Pair("feedings", feedingDataSource.feedings())))

  @GetMapping("/byTime")
  fun allByTime(@RequestParam(value = "hour", required = false, defaultValue = "10:00") hour: String,
                @RequestParam(value = "feeding", required = false) feeding: Int?): GenericResponse {
    require(feeding == null || feeding > 0) { "feeding must be > 0" }

    // no more than 10 feedings in a day!
    val feedingSummariesByTime = (1..10).map { FeedingSummaryByTime(it, ArrayList(), HashMap()) }

    feedingDataSource.feedingsByDay(hour).forEach {
      // per feeding time average
      val milkVolumeAverageMilliliters = Math.round(it.value.sumBy { it.milkVolumeMilliliters } / it.value.size.toFloat())
      it.value.forEachIndexed { i, feeding ->
        feedingSummariesByTime[i].feedings.add(feeding.copy(milkVolumeAverageMilliliters = milkVolumeAverageMilliliters))
      }
    }

    feedingSummariesByTime.forEach {
      val lastSevenDays = it.feedings.reversed().subList(0, Math.min(it.feedings.size, 7))
      it.summaries["sevenDay"] = Summary(
        Math.round(lastSevenDays.map { it.milkVolumeMilliliters }.average()).toInt(),
        lastSevenDays.map { it.time }.toSortedSet()
      )
    }

    val currentIndex = determineCurrentIndex(
      feedingSummariesByTime
        .filter { !it.feedings.isEmpty() && it.feedings.size > 2 }
        .map { it.summaries["sevenDay"]?.timesOfDay?.first() },
      dateFormatter.format(Date())
    )

    feedingSummariesByTime[currentIndex].current = true

    return if (feeding != null) {
      GenericResponse.ok(Pair("feedingSummariesByTime", feedingSummariesByTime.filter { it.feeding == feeding }))
    } else {
      GenericResponse.ok(Pair("feedingSummariesByTime", feedingSummariesByTime.filter { !it.feedings.isEmpty() && it.feedings.size > 2 }))
    }
  }

  @GetMapping("/byDay")
  fun allByDay(@RequestParam(value = "hour", required = false, defaultValue = "10:00") hour: String,
               @RequestParam(value = "sort", required = false, defaultValue = "date") sort: String): GenericResponse {
    val feedingsByDay = feedingDataSource.feedingsByDay(hour)
    val feedings = feedingsByDay.map { f ->
      FeedingSummaryByDay(
        f.key,
        f.value.size,
        f.value.sumBy { it.milkVolumeMilliliters },
        Math.round(f.value.sumBy { it.milkVolumeMilliliters } / f.value.size.toFloat()),
        f.value.sumBy { it.diaperTypes.size },
        f.value.sumBy { it.nursingDurationMinutes }
      )
    }

    // figure out how to make a generic comparator based off of `sort`
    val feedingsSorted = when (sort) {
      "numberOfFeedings" -> feedings.sortedByDescending { it.numberOfFeedings }
      "milkVolumeTotalMilliliters" -> feedings.sortedByDescending { it.milkVolumeTotalMilliliters }
      "milkVolumeAverageMilliliters" -> feedings.sortedByDescending { it.milkVolumeAverageMilliliters }
      "diaperCount" -> feedings.sortedByDescending { it.diaperCount }
      "nursingDurationMinutes" -> feedings.sortedByDescending { it.nursingDurationMinutes }
      else -> feedings.sortedByDescending { it.date }
    }

    return GenericResponse.ok(Pair("feedingSummariesByDay", feedingsSorted))
  }

  @GetMapping("/byDay/{date}")
  fun forDate(@PathVariable(value = "date") date: String,
              @RequestParam(value = "hour", required = false, defaultValue = "10:00") hour: String): GenericResponse {
    // validate that `date` has feedings

    val feedingsByDay = feedingDataSource.feedingsByDay(hour)
    return GenericResponse.ok(Pair("feedings", feedingsByDay.getOrDefault(date, emptyList())))
  }

  private fun determineCurrentIndex(feedingTimes: List<String?>, currentTime: String): Int {
    fun makeRelativeDate(time: String?): Date {
      val t = dateFormatter.parse(time).time
      return when (t < dateFormatter.parse(feedingTimes[0]).time) {
        true -> Date(t + TimeUnit.DAYS.toMillis(1))
        false -> Date(t)
      }
    }

    val feedingDates = feedingTimes.map(::makeRelativeDate)
    val currentDate = makeRelativeDate(currentTime)

    return feedingTimes.indexOf(
      dateFormatter.format(
        // find the *closest* feeding time relative to current time (may be in past or future)
        feedingDates
          .associateBy({ it }, { Math.abs(it.time - currentDate.time) }).entries
          .sortedBy { it.value }.get(0).key
      )
    )
  }
}

data class FeedingSummaryByDay(val date: String,
                               val numberOfFeedings: Int,
                               val milkVolumeTotalMilliliters: Int,
                               val milkVolumeAverageMilliliters: Int,
                               val diaperCount: Int,
                               val nursingDurationMinutes: Int) {
  var milkVolumeAverageOunces = Math.round(milkVolumeAverageMilliliters/ 29.5735 * 10) / 10.0
  var milkVolumeTotalOunces = Math.round(milkVolumeTotalMilliliters / 29.5735 * 10) / 10.0

}

data class FeedingSummaryByTime(val feeding: Int,
                                val feedings: MutableList<Feeding>,
                                val summaries: MutableMap<String, Summary>,
                                var current: Boolean = false)


data class Summary(val milkVolumeAverageMilliliters: Int,
                   val timesOfDay: Collection<String>)
