package com.motel.api.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController // Diz pro Spring: "Eu recebo requisições da web"
public class HelloController {

    @GetMapping("/") // Diz: "Quando alguém acessar a raiz (/), execute isso"
    public String hello() {
        return "Hello World";
    }
}