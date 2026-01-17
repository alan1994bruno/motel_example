package com.example.motel.local

import android.content.Context
import android.content.SharedPreferences

class TokenManager(context: Context) {
    private val prefs: SharedPreferences = context.getSharedPreferences("auth_prefs", Context.MODE_PRIVATE)
    private val editor = prefs.edit()

    // Salva o token no arquivo interno do celular
    fun saveToken(token: String) {
        editor.putString("USER_TOKEN", token)
        editor.apply() // .apply() salva em segundo plano para não travar a tela
    }

    // Recupera o token (retorna null se não existir)
    fun getToken(): String? {
        return prefs.getString("USER_TOKEN", null)
    }

    // Apaga o token (para quando fizer Logout)
    fun clearToken() {
        editor.remove("USER_TOKEN")
        editor.apply()
    }
}