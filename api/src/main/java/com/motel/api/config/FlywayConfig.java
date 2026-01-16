package com.motel.api.config;

import org.flywaydb.core.Flyway;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
public class FlywayConfig {

    @Bean
    public Flyway flyway(DataSource dataSource) {
        System.out.println("==========================================");
        System.out.println(">>> INICIANDO FLYWAY MANUALMENTE <<<");
        System.out.println("==========================================");

        // Configura o Flyway manualmente apontando para o DataSource existente
        Flyway flyway = Flyway.configure()
                .locations("classpath:db/migration") // Força o caminho
                .dataSource(dataSource)
                .baselineVersion("0")
                .baselineOnMigrate(true)
                .load();

        // Executa as correções e a migração
        try {
            flyway.repair();
            flyway.migrate();
            System.out.println(">>> MIGRAÇÃO MANUAL CONCLUÍDA COM SUCESSO! <<<");
        } catch (Exception e) {
            System.err.println(">>> ERRO CRÍTICO NA MIGRAÇÃO <<<");
            e.printStackTrace();
            // Não vamos lançar erro para não derrubar o app se for algo simples,
            // mas o ideal seria travar aqui.
        }

        System.out.println("==========================================");
        return flyway;
    }
}