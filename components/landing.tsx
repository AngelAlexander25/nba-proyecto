"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("equipos")
  const router = useRouter()

  const handleTabChange = (tabName) => {
    setActiveTab(tabName)
  }

  // Función para navegar a la app
  const navigateToApp = () => {
    router.push("/app")
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video autoPlay muted loop className="w-full h-full object-cover">
            <source src="/imagenes/22.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="relative z-10 text-center max-w-6xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Únete a la <span className="text-orange-500">Liga de</span>
            <br />
            Excelencia en <span className="text-orange-500">Predicciones NBA</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-4xl mx-auto">
            Descubre cómo nuestra plataforma combina datos reales con inteligencia artificial para revolucionar tus
            apuestas deportivas
          </p>
          <Button
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 px-8 py-4 text-lg rounded-full"
            onClick={navigateToApp}
          >
            Explorar Plataforma
          </Button>
        </div>
      </section>

      {/* Main Title */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Cómo Funciona Nuestra Plataforma de Estadísticas NBA con IA
          </h2>
        </div>
      </section>

      {/* Data Section */}
      <section
        className="py-20 relative"
        style={{ backgroundImage: "url('/imagenes/fondo.png')", backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Cómo Obtenemos los Datos</h2>
          <p className="text-xl text-gray-300">
            Nos conectamos directamente a <strong className="text-orange-500">APIs especializadas</strong> que ya tienen
            toda la información de la NBA
          </p>
        </div>
      </section>

      {/* API Cards */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {/* NBA Official API */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
              <div className="text-4xl mb-4">🏀</div>
              <h3 className="text-2xl font-bold mb-4 text-orange-500">NBA OFFICIAL API</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">DATOS OFICIALES</span>
                  <span className="text-orange-400 font-semibold">24/7</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">ESTADÍSTICAS</span>
                  <span className="text-orange-400 font-semibold">TIEMPO REAL</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">ACTUALIZACIONES</span>
                  <span className="text-orange-400 font-semibold">CADA 30MIN</span>
                </div>
              </div>
              <p className="text-gray-400 mb-4 text-sm">
                {"[ datos oficiales directamente de la NBA con estadísticas en tiempo real ]"}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-orange-500 font-semibold">FUENTE PRINCIPAL</span>
                <span className="text-orange-400">↗</span>
              </div>
            </div>

            {/* Sports Data APIs */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-2xl font-bold mb-4 text-orange-500">SPORTS DATA APIS</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">DATOS HISTÓRICOS</span>
                  <span className="text-orange-400 font-semibold">COMPLETOS</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">ESTADÍSTICAS</span>
                  <span className="text-orange-400 font-semibold">AVANZADAS</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">ANÁLISIS</span>
                  <span className="text-orange-400 font-semibold">PROFUNDO</span>
                </div>
              </div>
              <p className="text-gray-400 mb-4 text-sm">
                {"[ APIs especializadas en estadísticas deportivas con datos históricos completos ]"}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-orange-500 font-semibold">FUENTE SECUNDARIA</span>
                <span className="text-orange-400">↗</span>
              </div>
            </div>

            {/* Real-time Feeds */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold mb-4 text-orange-500">REAL-TIME FEEDS</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">FEEDS EN VIVO</span>
                  <span className="text-orange-400 font-semibold">INSTANTÁNEO</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">PARTIDOS</span>
                  <span className="text-orange-400 font-semibold">EN CURSO</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">ALERTAS</span>
                  <span className="text-orange-400 font-semibold">INMEDIATAS</span>
                </div>
              </div>
              <p className="text-gray-400 mb-4 text-sm">
                {"[ feeds en tiempo real para obtener información instantánea de partidos ]"}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-orange-500 font-semibold">FUENTE COMPLEMENTARIA</span>
                <span className="text-orange-400">↗</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-8 text-orange-500">Proceso de Extracción</h3>
              <div className="space-y-6">
                {[
                  {
                    num: "01",
                    title: "Conexión Automática",
                    desc: "Nuestro sistema se conecta a estas APIs cada 30 minutos",
                  },
                  {
                    num: "02",
                    title: "Descarga de Datos",
                    desc: "Extraemos estadísticas actualizadas de todos los equipos y jugadores",
                  },
                  { num: "03", title: "Almacenamiento", desc: "Guardamos esta información en nuestra base de datos" },
                  {
                    num: "04",
                    title: "Procesamiento",
                    desc: "Limpiamos y organizamos los datos para que sean fáciles de usar",
                  },
                ].map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="text-2xl font-bold text-orange-500 min-w-[60px]">{step.num}</div>
                    <div>
                      <h4 className="text-xl font-semibold mb-2 text-white">{step.title}</h4>
                      <p className="text-gray-400">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center">
              <img src="/imagenes/1.svg" alt="Proceso de extracción" className="max-w-full h-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">Stack Tecnológico</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">☕</span>
                <h3 className="text-2xl font-bold text-orange-500">Backend & APIs</h3>
              </div>
              <ul className="space-y-3 text-gray-300">
                <li>
                  <strong className="text-white">Java</strong> - Lenguaje principal para el backend
                </li>
                <li>
                  <strong className="text-white">Spring Boot</strong> - Framework para servicios REST
                </li>
                <li>
                  <strong className="text-white">Apache HttpClient</strong> - Comunicación con APIs
                </li>
                <li>
                  <strong className="text-white">MySQL/PostgreSQL</strong> - Base de datos
                </li>
              </ul>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">🤖</span>
                <h3 className="text-2xl font-bold text-orange-500">Inteligencia Artificial</h3>
              </div>
              <ul className="space-y-3 text-gray-300">
                <li>
                  <strong className="text-white">Weka</strong> - Machine learning en Java
                </li>
                <li>
                  <strong className="text-white">Apache Spark</strong> - Procesamiento de big data
                </li>
                <li>
                  <strong className="text-white">DL4J</strong> - Deep learning nativo para Java
                </li>
                <li>
                  <strong className="text-white">Apache Commons Math</strong> - Cálculos estadísticos
                </li>
              </ul>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">🌐</span>
                <h3 className="text-2xl font-bold text-orange-500">Frontend & Web</h3>
              </div>
              <ul className="space-y-3 text-gray-300">
                <li>
                  <strong className="text-white">React</strong> - Interfaz de usuario moderna
                </li>
                <li>
                  <strong className="text-white">Node.js</strong> - Runtime del servidor
                </li>
                <li>
                  <strong className="text-white">Express.js</strong> - Framework web
                </li>
                <li>
                  <strong className="text-white">Chart.js</strong> - Gráficos interactivos
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Prediction Section */}
      <section
        className="py-20 relative"
        style={{
          backgroundImage: "url('/imagenes/fondo2.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 text-white">Cómo Funciona la Predicción con IA</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Nuestro sistema de inteligencia artificial analiza múltiples factores para generar predicciones precisas
          </p>
        </div>
      </section>

      {/* System Features */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">Características del Sistema</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-2xl font-bold mb-4 text-orange-500">Automatización Total</h3>
              <p className="text-gray-400 mb-6">Sistema Java que funciona 24/7 sin intervención manual</p>
              <div className="bg-orange-500/20 rounded-lg p-4">
                <div className="text-3xl font-bold text-orange-500">30</div>
                <div className="text-sm text-gray-400">min entre actualizaciones</div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-2xl font-bold mb-4 text-orange-500">Escalabilidad</h3>
              <p className="text-gray-400 mb-6">Arquitectura de microservicios que maneja miles de usuarios</p>
              <div className="bg-orange-500/20 rounded-lg p-4">
                <div className="text-3xl font-bold text-orange-500">10K+</div>
                <div className="text-sm text-gray-400">usuarios simultáneos</div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold mb-4 text-orange-500">Tiempo Real</h3>
              <p className="text-gray-400 mb-6">Datos actualizados constantemente con React y WebSockets</p>
              <div className="bg-orange-500/20 rounded-lg p-4">
                <div className="text-3xl font-bold text-orange-500">{"<1"}</div>
                <div className="text-sm text-gray-400">segundo de latencia</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Information Types */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">Información Que Ofrecemos</h2>

          <div className="flex justify-center mb-8">
            <div className="bg-white/10 rounded-lg p-1 flex">
              {["equipos", "jugadores", "predicciones"].map((tab) => (
                <button
                  key={tab}
                  className={`px-6 py-3 rounded-md font-semibold transition-all ${
                    activeTab === tab ? "bg-orange-500 text-white" : "text-gray-400 hover:text-white"
                  }`}
                  onClick={() => handleTabChange(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {activeTab === "equipos" &&
              [
                { icon: "🏀", title: "Promedio de Puntos", desc: "Anotados y recibidos por partido" },
                { icon: "🏠", title: "Rendimiento Local/Visitante", desc: "Porcentaje de victorias según ubicación" },
                { icon: "📊", title: "Tendencias Recientes", desc: "Rachas ganadas y perdidas" },
                { icon: "🛡️", title: "Estadísticas Defensivas", desc: "Eficiencia defensiva y ofensiva" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center"
                >
                  <div className="text-3xl mb-4">{item.icon}</div>
                  <h4 className="text-lg font-semibold mb-2 text-white">{item.title}</h4>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              ))}

            {activeTab === "jugadores" &&
              [
                { icon: "⭐", title: "Estadísticas Principales", desc: "Puntos, rebotes y asistencias" },
                { icon: "🎯", title: "Porcentajes de Tiro", desc: "Desde diferentes zonas de la cancha" },
                { icon: "⏱️", title: "Minutos y Eficiencia", desc: "Tiempo jugado y rendimiento" },
                { icon: "📈", title: "Historial vs Equipos", desc: "Rendimiento contra equipos específicos" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center"
                >
                  <div className="text-3xl mb-4">{item.icon}</div>
                  <h4 className="text-lg font-semibold mb-2 text-white">{item.title}</h4>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              ))}

            {activeTab === "predicciones" &&
              [
                { icon: "🏆", title: "Probabilidad de Victoria", desc: "Porcentaje de ganar para cada equipo" },
                { icon: "📊", title: "Total de Puntos", desc: "Predicciones Over/Under" },
                { icon: "👤", title: "Rendimiento Individual", desc: "Proyecciones de jugadores clave" },
                { icon: "💎", title: "Oportunidades de Valor", desc: "Mejores apuestas identificadas" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center"
                >
                  <div className="text-3xl mb-4">{item.icon}</div>
                  <h4 className="text-lg font-semibold mb-2 text-white">{item.title}</h4>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-black">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-8">
            <h3 className="text-3xl font-bold mb-4 text-orange-500">
              ¿Listo para probar nuestras predicciones inteligentes?
            </h3>
            <p className="text-xl text-gray-400 mb-8">
              ¡Visita nuestra plataforma y descubre cómo la tecnología puede mejorar tu experiencia con las apuestas
              deportivas!
            </p>
            <Button
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 px-8 py-4 text-lg rounded-full"
              onClick={navigateToApp}
            >
              Comenzar Ahora
            </Button>
          </div>
          <div className="text-4xl mb-4">🏀</div>
          <p className="text-gray-500">
            © 2024 NBA Stats AI - Plataforma de Estadísticas NBA con Inteligencia Artificial
          </p>
        </div>
      </footer>
    </div>
  )
}
