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
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.RequestParam
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
  fun all(): List<Feeding> = feedingDataSource.feedings()

  @GetMapping("/byFeeding")
  fun allByFeeding(@RequestParam(value = "hour", required = false, defaultValue = "10:00") hour: String,
                   @RequestParam(value = "feeding", required = false) feeding: Int?): List<FeedingAggregate> {
    require(feeding == null || feeding > 0) { "feeding must be > 0" }

    val feedingAggregates = (1..10).map { FeedingAggregate(it, ArrayList(), HashMap()) }

    feedingDataSource.feedingsByDay(hour).forEach {
      it.value.forEachIndexed { i, feeding -> feedingAggregates[i].feedings.add(feeding) }
    }

    feedingAggregates.forEach {
      val lastSevenDays = it.feedings.reversed().subList(0, Math.min(it.feedings.size, 7))
      it.summaries["sevenDay"] = Summary(
        Math.round(lastSevenDays.map { it.milkVolumeMilliliters }.average()).toInt(),
        lastSevenDays.map { it.time }.toSortedSet()
      )
    }

    val currentIndex = determineCurrentIndex(
      feedingAggregates
        .filter { !it.feedings.isEmpty() && it.feedings.size > 2 }
        .map { it.summaries["sevenDay"]?.timesOfDay?.first() },
      dateFormatter.format(Date())
    )

    feedingAggregates[currentIndex].current = true

    if (feeding != null) {
      return feedingAggregates.filter { it.feeding == feeding }
    }

    return feedingAggregates.filter { !it.feedings.isEmpty() && it.feedings.size > 2 }
  }

  @GetMapping("/byDay")
  fun allByDay(@RequestParam(value = "hour", required = false, defaultValue = "10:00") hour: String,
               @RequestParam(value = "sort", required = false, defaultValue = "date") sort: String): List<DailyFeedingAggregate> {
    val feedingsByDay = feedingDataSource.feedingsByDay(hour)
    val feedings = feedingsByDay.map { f ->
      DailyFeedingAggregate(
        f.key,
        f.value.size,
        f.value.sumBy { it.milkVolumeMilliliters },
        Math.round(f.value.sumBy { it.milkVolumeMilliliters } / f.value.size.toFloat()),
        f.value.sumBy { it.diaperTypes.size },
        f.value.sumBy { it.nursingDurationMinutes }
      )
    }

    // figure out how to make a generic comparator based off of `sort`
    when (sort) {
      "numberOfFeedings" -> return feedings.sortedByDescending { it.numberOfFeedings }
      "milkVolumeTotalMilliliters" -> return feedings.sortedByDescending { it.milkVolumeTotalMilliliters }
      "milkVolumeAverageMilliliters" -> return feedings.sortedByDescending { it.milkVolumeAverageMilliliters }
      "diaperCount" -> return feedings.sortedByDescending { it.diaperCount }
      "nursingDurationMinutes" -> return feedings.sortedByDescending { it.nursingDurationMinutes }
      else -> return feedings.sortedByDescending { it.date }
    }
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

data class DailyFeedingAggregate(val date: String,
                                 val numberOfFeedings: Int,
                                 val milkVolumeTotalMilliliters: Int,
                                 val milkVolumeAverageMilliliters: Int,
                                 val diaperCount: Int,
                                 val nursingDurationMinutes: Int)

data class FeedingAggregate(val feeding: Int,
                            val feedings: MutableList<Feeding>,
                            val summaries: MutableMap<String, Summary>,
                            var current: Boolean = false)


data class Summary(val milkVolumeAverageMilliliters: Int,
                   val timesOfDay: Collection<String>)
