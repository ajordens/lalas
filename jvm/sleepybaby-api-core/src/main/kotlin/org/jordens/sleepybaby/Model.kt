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

package org.jordens.sleepybaby

data class Feeding(val date: String,
                   val time: String,
                   val nursingDurationMinutes: Int,
                   val milkType: String,
                   val milkVolumeMilliliters: Int,
                   val bodyTemperature: Double?,
                   val diaperTypes: Collection<String>,
                   val notes: String,
                   val milkVolumeAverageMilliliters: Int? = null) // this is a hack

data class FeedingSummaryByDay(val date: String,
                               val numberOfFeedings: Int,
                               val milkVolumeTotalMilliliters: Int,
                               val diaperCount: Int,
                               val nursingDurationMinutes: Int) {
  val milkVolumeAverageMilliliters = Math.round(milkVolumeTotalMilliliters / numberOfFeedings.toFloat())

  // ounces are rounded to one decimal
  val milkVolumeAverageOunces = Math.round(milkVolumeAverageMilliliters / 29.5735 * 10) / 10.0
  val milkVolumeTotalOunces = Math.round(milkVolumeTotalMilliliters / 29.5735 * 10) / 10.0
}

data class FeedingSummaryByTime(val feeding: Int,
                                val feedings: MutableList<Feeding>,
                                val summaries: MutableMap<String, Summary>,
                                var current: Boolean = false)


data class Summary(val milkVolumeAverageMilliliters: Int,
                   val timesOfDay: Collection<String>)


data class Diaper(val date: String, val time: String, val diaperType: String)

data class DiaperSummaryByDay(val date: String,
                              val diaperCount: Int)
