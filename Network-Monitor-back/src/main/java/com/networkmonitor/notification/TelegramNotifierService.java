package com.networkmonitor.notification;

import com.networkmonitor.config.TelegramConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class TelegramNotifierService implements NotificationSender {

    private static final Logger log = LoggerFactory.getLogger(TelegramNotifierService.class);

    private final TelegramConfig config;
    private final RestClient restClient = RestClient.create();

    public TelegramNotifierService(TelegramConfig config) {
        this.config = config;
    }

    @Override
    @Async
    public void send(String message) {
        if (!config.isEnabled()) {
            log.debug("Telegram deshabilitado, mensaje no enviado: {}", message);
            return;
        }
        try {
            String url = "https://api.telegram.org/bot%s/sendMessage".formatted(config.getBotToken());
            log.info("URL construida: {}", url);
            restClient.post()
                    .uri(url)
                    .contentType(org.springframework.http.MediaType.APPLICATION_FORM_URLENCODED)
                    .body("chat_id=%s&text=%s".formatted(config.getChatId(), message))
                    .retrieve()
                    .toBodilessEntity();
        } catch (Exception e) {
            log.error("Fallo al enviar mensaje a Telegram: {}", e.getMessage());
        }
    }
}