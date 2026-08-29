package com.networkmonitor.api;

import com.networkmonitor.notification.NotificationSender;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TelegramTestController {

    private final NotificationSender notificationSender;

    public TelegramTestController(NotificationSender notificationSender) {
        this.notificationSender = notificationSender;
    }

    @PostMapping("/telegram")
    public ResponseEntity<Void> testTelegram() {
        notificationSender.send("Prueba desde Network Monitor 🚀");
        return ResponseEntity.ok().build();
    }
}