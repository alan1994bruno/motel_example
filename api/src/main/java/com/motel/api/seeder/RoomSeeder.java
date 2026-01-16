package com.motel.api.seeder;

import com.motel.api.model.File;
import com.motel.api.model.Room;
import com.motel.api.repository.RoomRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Configuration
public class RoomSeeder implements CommandLineRunner {

    private final RoomRepository roomRepository;

    public RoomSeeder(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // Se já tiver quartos cadastrados, não faz nada para evitar duplicidade
        if (roomRepository.count() > 0) {
            System.out.println(">>> SEED: Quartos já existem. Pulando criação.");
            return;
        }

        System.out.println(">>> SEED: Criando Quartos Padrão...");

        // 1. SELF (20.00)
        createRoom("Self", new BigDecimal("20.00"), 5, List.of(
                "https://raw.githubusercontent.com/alan1994bruno/images/refs/heads/master/Self/1.jpg",
                "https://raw.githubusercontent.com/alan1994bruno/images/refs/heads/master/Self/2.jpg",
                "https://raw.githubusercontent.com/alan1994bruno/images/refs/heads/master/Self/3.jpg"
        ));

        // 2. SELF PLUS (30.00)
        createRoom("Self Plus", new BigDecimal("30.00"), 5, List.of(
                "https://raw.githubusercontent.com/alan1994bruno/images/refs/heads/master/SelfPlus/1.jpg",
                "https://raw.githubusercontent.com/alan1994bruno/images/refs/heads/master/SelfPlus/2.jpg",
                "https://raw.githubusercontent.com/alan1994bruno/images/refs/heads/master/SelfPlus/3.jpg"
        ));

        // 3. ERÓTICA (40.00)
        createRoom("Erótica", new BigDecimal("40.00"), 5, List.of(
                "https://raw.githubusercontent.com/alan1994bruno/images/refs/heads/master/Erotica/1.jpg",
                "https://raw.githubusercontent.com/alan1994bruno/images/refs/heads/master/Erotica/2.jpg",
                "https://raw.githubusercontent.com/alan1994bruno/images/refs/heads/master/Erotica/3.jpg"
        ));

        // 4. ERÓTICA HIDRO (60.00)
        createRoom("Erótica Hidro", new BigDecimal("60.00"), 5, List.of(
                "https://raw.githubusercontent.com/alan1994bruno/images/refs/heads/master/EroticaHidro/1.jpg",
                "https://raw.githubusercontent.com/alan1994bruno/images/refs/heads/master/EroticaHidro/2.jpg",
                "https://raw.githubusercontent.com/alan1994bruno/images/refs/heads/master/EroticaHidro/3.jpg"
        ));

        // 5. NUDES HIDRO (80.00)
        createRoom("Nudes Hidro", new BigDecimal("80.00"), 5, List.of(
                "https://raw.githubusercontent.com/alan1994bruno/images/refs/heads/master/NudesHidro/1.jpg",
                "https://raw.githubusercontent.com/alan1994bruno/images/refs/heads/master/NudesHidro/2.jpg",
                "https://raw.githubusercontent.com/alan1994bruno/images/refs/heads/master/NudesHidro/3.jpg"
        ));

        // 6. DUPLEX HIDRO (120.00)
        createRoom("Duplex Hidro", new BigDecimal("120.00"), 5, List.of(
                "https://raw.githubusercontent.com/alan1994bruno/images/refs/heads/master/DuplexHidro/1.jpg",
                "https://raw.githubusercontent.com/alan1994bruno/images/refs/heads/master/DuplexHidro/2.jpg",
                "https://raw.githubusercontent.com/alan1994bruno/images/refs/heads/master/DuplexHidro/3.jpg"
        ));

        System.out.println(">>> SEED: 6 Quartos criados com sucesso!");
    }

    // Método auxiliar para não ficar repetindo código
    private void createRoom(String name, BigDecimal price, Integer units, List<String> imageUrls) {
        Room room = new Room();
        room.setName(name);
        room.setHourlyRate(price);
        room.setUnits(units);

        // Converte Strings (URLs) para Entidades (File)
        List<File> files = imageUrls.stream()
                .map(url -> new File(url))
                .collect(Collectors.toList());

        room.setImages(files);

        roomRepository.save(room);
    }
}