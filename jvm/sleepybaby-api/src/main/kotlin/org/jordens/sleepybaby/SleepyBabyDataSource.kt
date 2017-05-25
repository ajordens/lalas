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

import org.apache.commons.csv.CSVFormat
import org.apache.commons.csv.CSVRecord
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import java.io.StringReader
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.concurrent.atomic.AtomicReference

@Component
class FeedingDataSource @Autowired constructor(val configuration: FeedingsConfigurationProperties) {
  private val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd")
  private val logger = LoggerFactory.getLogger(FeedingDataSource::class.java)
  private val feedings: AtomicReference<List<Feeding>> = AtomicReference(emptyList())

  fun feedings(): List<Feeding> = feedings.get()

  /**
   * @param hour The day starts at `hour`
   */
  fun feedingsByDay(hour: String = "10:00"): Map<String, List<Feeding>> {
    return feedings().groupByTo(mutableMapOf()) {
      if (it.time < hour) {
        LocalDate.parse(it.date, formatter).minusDays(1).format(formatter)
      } else {
        it.date
      }
    }
  }

  @Scheduled(fixedRate = 300000)
  fun fetchFeedings() {
    val sourceUrl = configuration.sourceAsUrl()
    logger.info("Fetching feedings from $sourceUrl")

    val column = { record: CSVRecord, columnName: String ->
      val value = record.get(columnName)
      if (value.isNullOrEmpty()) null else value
    }

    val records = CSVFormat.RFC4180.withFirstRecordAsHeader().parse(StringReader(sourceUrl.readText()))
    feedings.set(
      records.map { record ->
        Feeding(
          column(record, "date") ?: "n/a",
          column(record, "time") ?: "n/a",
          (column(record, "nursing_duration_minutes") ?: "0").toInt(),
          column(record, "milk_type") ?: "n/a",
          (column(record, "milk_volume_ml") ?: "0").toInt(),
          column(record, "body_temperature")?.toDouble(),
          (column(record, "diaper_type") ?: "").split(","),
          column(record, "notes") ?: "n/a"
        )
      }.filter { it.date != "n/a" }
    )

    logger.info("Fetched ${feedings.get().size} feedings from $sourceUrl")
  }
}
