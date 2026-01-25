package com.example.motel.network


import android.util.Log
import com.example.motel.BuildConfig
import com.example.motel.network.dto.*
import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path

interface ApiService {
    // CONFIRA SE AS ROTAS BATEM COM SEU CONTROLLER NO SPRING
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): AuthResponse

    @POST("auth/register")
    suspend fun register(@Body request: RegisterRequest): AuthResponse

    @GET("rooms")
    suspend fun getRooms(): List<RoomDto>

    @POST("reservations")
    suspend fun createReservation(@Body request: CreateReservationRequest): Unit

    @GET("penalties/my-penalty")
    suspend fun getMyPenalty(): PenaltyDto

    @GET("reservations/my-reservation")
    suspend fun getMyReservation(): ReservationDto

    @DELETE("reservations/{publicId}")
    suspend fun cancelReservation(@Path("publicId") publicId: String): Unit
}

object RetrofitClient {
    private val BASE_URL = BuildConfig.BASE_URL

    // Variável global para guardar o token na memória
    var authToken: String? = null

    // Configuração do Cliente HTTP (O "Carteiro")
    private val okHttpClient = OkHttpClient.Builder()
        .addInterceptor { chain ->
            // 1. Pega a requisição original
            val originalRequest = chain.request()

            // 2. Cria uma nova adicionando o Header se tiver token
            val requestBuilder = originalRequest.newBuilder()
            Log.w("erro","Bearer $authToken")
            if (authToken != null) {
                // Adiciona "Authorization: Bearer eyJhbG..."
                requestBuilder.addHeader("Authorization", "Bearer $authToken")
                Log.d("RetrofitClient", "Token injetado no Header")
            }

            // 3. Segue o baile
            chain.proceed(requestBuilder.build())
        }
        .build()

    val api: ApiService by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(okHttpClient) // <--- Conecta o cliente configurado aqui
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(ApiService::class.java)
    }
}