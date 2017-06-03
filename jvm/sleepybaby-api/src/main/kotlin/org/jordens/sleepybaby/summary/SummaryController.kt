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

package org.jordens.sleepybaby.summary

import org.jordens.sleepybaby.FeedingDataSource
import org.jordens.sleepybaby.GenericResponse
import org.jordens.sleepybaby.ext.diffDays
import org.jordens.sleepybaby.ext.format
import org.jordens.sleepybaby.ext.minusDays
import org.jordens.sleepybaby.ext.parseDate
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.*

/**
 * Summarized feeding facts.
 *
 * - time since last record high feeding
 * - # of diapers changed 7 days / 30 days / all time
 * - formula vs non-formula patterns
 */
@RestController
@RequestMapping(value = "/api/summaries")
class SummaryController @Autowired constructor(val feedingDataSource: FeedingDataSource) {
  val logger = LoggerFactory.getLogger(SummaryController::class.java)

  @GetMapping
  fun all(): GenericResponse {
    val summaries = listOf(
      totalVolumeByMilkAndFormula(),
      biggestFeedingByMilkAndFormula(365),
      biggestFeedingByMilkAndFormula(30),
      biggestFeedingByMilkAndFormula(7),
      biggestDay(365),
      biggestDay(30),
      biggestDay(7)
    )

    return GenericResponse.ok(Pair("summaries", summaries))
  }

  private fun daysAgo(input: String) : Long = parseDate("yyyy-MM-dd", input).diffDays(Date())

  private fun totalVolumeByMilkAndFormula(): Summary {
    val feedings = feedingDataSource.feedings()
    val tM = feedings.filter { it.milkType == "B" }.sumBy { it.milkVolumeMilliliters }
    val tF = feedings.filter { it.milkType == "F" }.sumBy { it.milkVolumeMilliliters }

    val startDate = feedings[0].date
    val startDateDaysAgo = daysAgo(startDate)

    return Summary(
      "totalVolumeByMilkAndFormula",
      SummaryDetail(
        "${tM}ml of milk and ${tF}ml of formula since $startDate (${feedings.size} feedings over $startDateDaysAgo days)",
        emptyMap()
      )
    )
  }

  private fun biggestFeedingByMilkAndFormula(lastNDays: Long): Summary {
    val cutoffDate = Date().minusDays(lastNDays).format("yyyy-MM-dd")

    val feedings = feedingDataSource.feedings().filter { it.date >= cutoffDate }.sortedBy { it.milkVolumeMilliliters }
    val bM = feedings.findLast { it.milkType == "B" }
    val bF = feedings.findLast { it.milkType == "F" }

    return Summary(
      "biggestFeedingByMilkAndFormula${lastNDays}Days",
      SummaryDetail(
        "${bM?.milkVolumeMilliliters}ml of milk (${bM?.date}) and ${bF?.milkVolumeMilliliters}ml of formula (${bF?.date})",
        emptyMap()
      )
    )
  }

  private fun biggestDay(lastNDays: Long): Summary {
    val cutoffDate = Date().minusDays(lastNDays).format("yyyy-MM-dd")

    val feedingsByDay = feedingDataSource.feedingsByDay()

    val biggestDay = feedingsByDay.keys.filter { it >= cutoffDate }.sortedBy {
      feedingsByDay.get(it)?.sumBy { -it.milkVolumeMilliliters }
    }[0]

    val volume = feedingsByDay.get(biggestDay)?.sumBy { it.milkVolumeMilliliters }

    return Summary(
      "biggestDay${lastNDays}Days",
      SummaryDetail(
        "${volume}ml of milk on ${biggestDay} (${parseDate("yyyy-MM-dd", biggestDay).diffDays(Date())} days ago)",
        emptyMap()
      )
    )
  }

  // percentage of total per feeding

}

data class Summary(val id: String, val detail: SummaryDetail)

data class SummaryDetail(val messsage: String, val context: Map<String, Any>)
