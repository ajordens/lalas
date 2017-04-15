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
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

/**
 * Summarized feeding facts.
 *
 * - time since last record high feeding
 * - # of diapers changed 7 days / 30 days / all time
 * - formula vs non-formula patterns
 */
@RestController
@RequestMapping(value = "/api/summaries")
class FeedingSummaryController @Autowired constructor(val feedingDataSource: FeedingDataSource) {
  val logger = LoggerFactory.getLogger(FeedingController::class.java)

  @GetMapping
  fun all(): List<Feeding> = feedingDataSource.feedings()
}

data class FeedingSummary(val date: String,
                          val numberOfFeedings: Int,
                          val milkVolumeTotalMilliliters: Int,
                          val milkVolumeAverageMilliliters: Int,
                          val diaperCount: Int,
                          val nursingDurationMinutes: Int)
