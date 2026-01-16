package com.motel.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MotelApplication {

	public static void main(String[] args) {
		SpringApplication.run(MotelApplication.class, args);
	}

}
