package com.example.motel.network


import android.util.Log
import com.example.motel.BuildConfig
import com.example.motel.network.dto.*
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.Body
import retrofit2.http.POST

interface ApiService {
    // CONFIRA SE AS ROTAS BATEM COM SEU CONTROLLER NO SPRING
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): AuthResponse

    @POST("auth/register")
    suspend fun register(@Body request: RegisterRequest): AuthResponse
}

object RetrofitClient {
    // Agora pegamos da configuração segura
    private const val BASE_URL = BuildConfig.BASE_URL

    init {
        Log.d("RetrofitClient", "A URL Base carrega é: $BASE_URL")
    }

    val api: ApiService by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(ApiService::class.java)
    }
}