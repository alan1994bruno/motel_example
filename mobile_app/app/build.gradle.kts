import java.util.Properties
import java.io.FileInputStream

plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "com.example.motel"
    // Nota: release(36) pode dar erro se não tiver o preview instalado.
    // Se der erro, mude para: compileSdk = 35
    compileSdk {
        version = release(36)
    }

    defaultConfig {
        applicationId = "com.example.motel"
        minSdk = 28
        targetSdk = 35 // Ajustado para 35 (Estável atual) ou mantenha 36 se tiver preview
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"

        // --- LÓGICA PARA LER O LOCAL.PROPERTIES ---
        val localProperties = Properties()
        val localPropertiesFile = rootProject.file("local.properties")
        if (localPropertiesFile.exists()) {
            localProperties.load(FileInputStream(localPropertiesFile))
        }

        // Pega a URL do arquivo ou usa string vazia se falhar
        val apiUrl = localProperties.getProperty("API_BASE_URL") ?: ""

        // Cria o campo BuildConfig.BASE_URL
        // A contrabarra \" é necessária porque é uma String dentro de uma String
        buildConfigField("String", "BASE_URL", "\"$apiUrl\"")
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_21
        targetCompatibility = JavaVersion.VERSION_21
    }
    buildFeatures {
        compose = true
        buildConfig = true // <--- ISSO É OBRIGATÓRIO PARA FUNCIONAR
    }
}

dependencies {
    implementation("androidx.compose.material:material-icons-extended:1.7.6")
    implementation("io.coil-kt:coil-compose:2.5.0")
    // Networking
    implementation("com.squareup.retrofit2:retrofit:2.9.0")
    implementation("com.squareup.retrofit2:converter-gson:2.9.0")

    // Lifecycle
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.8.7")

    // Navegação entre telas
    implementation("androidx.navigation:navigation-compose:2.8.5")

    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.compose.ui.graphics)
    implementation(libs.androidx.compose.ui.tooling.preview)
    implementation(libs.androidx.compose.material3)
    implementation(libs.androidx.material3)
    testImplementation(libs.junit)
    androidTestImplementation(libs.androidx.junit)
    androidTestImplementation(libs.androidx.espresso.core)
    androidTestImplementation(platform(libs.androidx.compose.bom))
    androidTestImplementation(libs.androidx.compose.ui.test.junit4)
    debugImplementation(libs.androidx.compose.ui.tooling)
    debugImplementation(libs.androidx.compose.ui.test.manifest)
}