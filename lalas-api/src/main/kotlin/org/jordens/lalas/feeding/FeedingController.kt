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

package org.jordens.lalas.feeding

import org.jordens.lalas.Feeding
import org.jordens.lalas.FeedingDataSource
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.RequestParam

@RestController
@RequestMapping(value = "/api/feedings")
class FeedingController @Autowired constructor(val feedingDataSource: FeedingDataSource) {
  val logger = LoggerFactory.getLogger(FeedingController::class.java)

  @GetMapping("/")
  fun all(): List<Feeding> = feedingDataSource.feedings()

  @GetMapping("/byFeeding")
  fun allByHour(@RequestParam(value="hour", required=false, defaultValue = "10:00") hour: String,
                @RequestParam(value="feeding", required=true) feeding: Int): List<Feeding> {
    require(feeding > 0) { "feeding must be > 0" }
    return feedingDataSource.feedingsByDay(hour).map { it.value.get(feeding - 1) }.sortedByDescending { it.date }
  }

  @GetMapping("/byDay")
  fun allByDay(@RequestParam(value = "hour", required = false, defaultValue = "10:00") hour: String,
               @RequestParam(value = "sort", required = false, defaultValue = "date") sort: String): List<FeedingAggregate> {
    val feedingsByDay = feedingDataSource.feedingsByDay(hour)
    val feedings = feedingsByDay.map { f ->
      FeedingAggregate(
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
}

data class FeedingAggregate(val date: String,
                            val numberOfFeedings: Int,
                            val milkVolumeTotalMilliliters: Int,
                            val milkVolumeAverageMilliliters: Int,
                            val diaperCount: Int,
                            val nursingDurationMinutes: Int)
