package org.jordens.sleepybaby.diaper

import org.jordens.sleepybaby.Diaper
import org.jordens.sleepybaby.DiaperSummaryByDay
import org.jordens.sleepybaby.FeedingDataSource
import org.jordens.sleepybaby.GenericResponse
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.text.SimpleDateFormat

@RestController
@RequestMapping(value = "/api/diapers")
class DiaperController @Autowired constructor(val feedingDataSource: FeedingDataSource) {
  val logger = LoggerFactory.getLogger(DiaperController::class.java)
  val dateFormatter = SimpleDateFormat("HH:mm")

  @GetMapping
  fun all(): GenericResponse = GenericResponse.ok(Pair("diapers", feedingDataSource.feedings().flatMap { feeding ->
    feeding.diaperTypes.map {
      Diaper(feeding.date, feeding.time, it)
    }
  }))

  @GetMapping("/byDay")
  fun allByDay(@RequestParam(value = "hour", required = false, defaultValue = "10:00") hour: String,
               @RequestParam(value = "sort", required = false, defaultValue = "date") sort: String): GenericResponse {
    val feedingsByDay = feedingDataSource.feedingsByDay(hour)
    val diapers = feedingsByDay.map { f ->
      DiaperSummaryByDay(
        f.key,
        f.value.sumBy { it.diaperTypes.size }
      )
    }.sortedByDescending { it.date }

    return GenericResponse.ok(Pair("diaperSummariesByDay", diapers))
  }
}
