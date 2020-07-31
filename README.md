# StreamBox-BackendFinal

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/24e50e3f04e5474ea1ef70eef2c273fc)](https://app.codacy.com/manual/CAndresRa/StreamBox-BackendFinal?utm_source=github.com&utm_medium=referral&utm_content=CAndresRa/StreamBox-BackendFinal&utm_campaign=Badge_Grade_Dashboard)
 [![CircleCI](https://circleci.com/gh/circleci/circleci-docs.svg?style=svg)](https://circleci.com/gh/CAndresRa/StreamBox-BackendFinal)

# Uso

Debido a que el frontend y el backend se encuentran en repositorios diferentes con despliegue independiente se recomienda para garantizar el funcionamiento correcto de la aplicación se procedera a:

* Iniciar el servidor backend mediante la url:

  [streambox-backend](https://streamboxback.herokuapp.com/)

* Ingresar a StreamBox mediante la siguiente url:

  [https://streamabox.herokuapp.com/](https://streamabox.herokuapp.com/)
  
Una vez ingresemos a la pagina web nos encontraremos con la siguiente vista que corresponde a la pagina principal de StreamBox.

![](https://github.com/CAndresRa/StreamBox-BackendFinal/blob/master/ImgReadme/PaginaPrincipal.png)

Para acceder a una sala se deben llenar los siguientes campos

* **Nickname**: Corresponde a su nombre o apodo que utilizara en la sala.
* **Room**: Corresponde al nombre con el cual se creara la sala o a la cual desea ingresar.

A continuacíon se une a la sala respectiva la cual tiene la siguiente vista:

![](https://github.com/CAndresRa/StreamBox-BackendFinal/blob/master/ImgReadme/Room.png)

Se encontraran los siguentes componentes en la vista.

* En la parte superior izquierda se encuentra un campo llamado **Youtube video URL** con su respectivo boton **Search**, este recibe cualquier **URL** de un video de youtube y lo cargara en la zona del reproductor.

* **Reproductor**: Similar al reproductor de Youtube, las acciones realizadas en el reproductor se compartiran con todos los participantes que se encuentren en la sala, permitiendo que cualquier participante pueda:

    - **Pausar** el video.

    - **Reproducir** el video.

    - **Adelantar** el video.

    - **Retroceder** el video.

    - **Cambiar** el video.

**La sincronización se realiza de manera automatica al momento de que exista alguna pausa en el video** sin embargo contamos con un boton llamado **Synchronize** el cual se mencionara a continuación.

* **Synchronize**: Es un boton que permite sincronizar el video manualmente a todos los participantes de la sala, se usa en caso de un error en la sincronizacion automatica, por ejemplo:

Cuando se unen nuevos participantes despues del inicio del video, este solo cargara el video en el reproductor, así que la persona que se encuentra en el minuto correspondiente debera utilizar el boton **Synchronize** para que los nuevos participantes en la sala se emparejen con el resto.

* **Chat**: Se ubica en el lado derecho de la pantalla y se puede utilizar poniendo el mensaje que se desea enviar y con la tecla enter o click en **send**, el chat utiliza el nombre de usuario ingresado, en dado caso se ingrese mediante la URL de la sala se cargara automaticamente como **Anónimo**.


# Herramientas de desarrollo

Para el desarrollo de StreamBox se utilizaron las siguientes herramientas.

* **Maven**: Herramienta para la construccion y gestion del mismo.
* **Lenguaje de programación**: Java, JavaScript.
* **Framework**: Spring.
* **Desarrollo web**: React.
* **Persitencia**: Base de datos no relacional MongoDB.
* **Despliegue**: Heroku.
* **Github**.

# Arquitectura

La arquitectura utilizada para realizar el proyecto se muestra a continuación:

![](https://github.com/CAndresRa/StreamBox-BackendFinal/blob/master/ImgReadme/ArquitecturaStreambox.png)

La aplicación esta diseñada para que multiples usuarios interactuen en tiempo real con los componentes explicados anteriormente, los clientes ingresan a la pagina principal de StreamBox la cual se encuentra desplegada en **Heroku**, una vez acceden a la sala correspondiente se encuentran con los dos componentes principales **Componente Youtube** y **Componente Chat**.

## Frontend

### Componente Youtube:

El componente Youtube se conforma de 3 partes escenciales:

### Barra de url:

Es el subcomponente que se encarga de recibir las url de videos de youtube y convertilas en un **video id** que el reproductor pueda identificar, actualmente en Youtube se manejan 3 tipos de url, a continuación se nombraran y en negrilla se encontrara señalado el id del video correspondiente.

- **URL app youtube para celular**: https://youtu.be/OzOruOeEZ4I el id se encuentra despues del ultimo **/** y corresponde a **OzOruOeEZ4I**.
- **URL web page simple video**: https://www.youtube.com/watch?v=S_roMeig-YQ el id se encuentra despues del **=** y corresponde a **S_roMeig-YQ**.
- **URL web page play list**: https://www.youtube.com/watch?v=ph6fmk27grc&list=RDph6fmk27grc&start_radio=1 el id se encuentra despues del primer **=** y antes del **&**, corresponde a **ph6fmk27grc**.
    
    - Cuando sucede el evento de buscar un video, el frontend se comunica con el backend de dos maneras, mediante **http** se realiza una solicitud **GET** para obtener la url del video, esto permitira un **callback** que actualizara el browser del cliente.
    - Al mismo tiempo se realizara una comunicación vía **Websocket** el cual será el encargado de actualizar el video en la base de datos no relacional **MongoDB** y adicionalmente de realizar el broadcast hacia todos los subscriptores de la sala.
    
### Reproductor:

Para el reproductor fue utilizada la Api de youtube llamada **YouTube Player API**, encontrara el link a continuación.

[https://developers.google.com/youtube/iframe_api_reference?hl=es-419](https://developers.google.com/youtube/iframe_api_reference?hl=es-419)

La API ofrecida por youtube esta orientada para aportar una forma a los desarrolladores de **Incrustar (Embeber)** su reproductor en paginas externas a Youtube con el fin de enriquecer paginas web o aplicaciones que consuman este servicio. Adicionalmente esta API cuenta con instrucciones detalladas de metodos que permiten conocer y controlar el **estado del video, tiempo actual en el reproductor y actualizar el tiempo del video**.

* **Estados del video**:
    - -1 - unstarted (sin empezar)
    - 0 - ended (terminado)
    - 1 - playing (en reproducción)
    - 2 - paused (en pausa)
    - 3 - buffering (almacenando en búfer)
    - 5 - video cued (video en fila)
  
* **Metodos importantes**:

    - `player.getCurrentTime():Number` Tiempo actual del video
    - `player.playVideo():Void` Reproducir video
    - `player.pauseVideo():Void` Pausar Video
    - `player.seekTo(seconds:Number, allowSeekAhead:Boolean):Void` Actualizar minuto del video
    - `player.getPlayerState():Number` Obtener estado del video

* **Implementación**:

La API de Youtube da un formato para aplicar el componente en JavaScript, sin embargo para la implementación en **React** existe una libreria que utiliza implementa la API llamada **react-youtube**, en terminos generales ofrece el mismo esquema de Youtube API y permite utilizar todos los metodos de la API sin diferencia alguna.

```       
          <YouTube
            videoId = {this.state.videoId}
            opts = {opts}
            onReady = {this.videoOnReady}
            onStateChange = {this.videoOnStateChange}
            getCurrentTime = {this.getCurrentTime}
            onPlay = { this.onPlay }
            onPause = { this.onPause }
          />
```

En la implementación anterior desde el **tag Youtube** y con ayuda de la API de Youtube ponemos a escuchar eventos particulares que ocurran en el mismo y se ligan a una funcion - metodo, particular que se encargara de tomar acciones respectivas a los cambios ocurridos.


### Boton de sincronización

El boton de **Synchronize** permite una sincronización manual por parte de los participantes en caso de algun error en la sincronización, este boton activa el metodo `player.seekTo(seconds:Number, allowSeekAhead:Boolean):Void` en el reproductor, el cual envia al servidor el tiempo actual del video, el servidor realiza el broadcast sobre todos los subscriptores y ubica el video en el minuto correspondiente.

### Componente Chat:

A la derecha de la pantalla encontramos el componente del chat, el cual cuenta con el nombre de la sala y utiliza el nombre con el que ingreso a la sala, en dado caso que se ingrese a la sala mediante el link correspondiente el usuario se cargara como **Anónimo**, el componente intactua con el servidor enviando mensajes, el servidor realiza el broadcast correspondiente a los miembros subscritos en la sala.


## Backend

![](https://github.com/CAndresRa/StreamBox-BackendFinal/blob/master/ImgReadme/Digrama%20de%20clase.png)

Nos enfocaremos en describir el comportamiento del backend para lograr la sincronización y el manejo de los videos, mediante el uso de Stomp se realiza la conexion al endpoint websocket de nuestro servidor, a continuación las solicitudes que vienen desde el cliente son recibidas por la clase **VideoStompController** y **VideoController**, cuando ocurre una petición de cambiar el video, mediante la clase de **VideoStompController** se actualiza por el nombre de la sala en la base de datos **MongoDB**, esto genera que cuando existan nuevas conexiones al endpoint de la sala correspondiente, se realice la solicitud a **VideoController** para obtener el ultimo video visto en la sala. Se evidencia claramente que las operaciones correspondientes al video son responsabilidad de la interface **VideoService** que es implementada por **VideoServiceImpl** la cual se conecta con el **VideoRoomRepository** para la parte de persistencia, por otra parte el diseño del **ChatStompController** es una implementación que se encarga plenamente de recibir los nuevos mensajes y entregalos a los subscriptores correspondientes.

## Patrones de diseño 

![](https://github.com/CAndresRa/StreamBox-BackendFinal/blob/master/ImgReadme/publishSubs.png)

### Publish - Subscribe 

[Diferencia entre patron del observador y publish-subscribe](https://hackernoon.com/observer-vs-pub-sub-pattern-50d3b27f838c)

Para la implementación de la aplicación se utiliza el patron de diseño publish-subscribe, este patron involucra un intermediario **MessageBroker** en el canal de comunicación entre el publish y los subscriptores que se encuentran en el canal, el canal se ve representado en la imagen de arquitectura como el endpoint a un websocket que contiene topicos especificos.


## Pruebas 

Se utilizaron pruebas unitaras JUnit que buscaban probar los metodos utilizados en las interraciones del video, algunas de estas pruebas se orientaron a la:

* Obtención del video Id dada cualquier URL.
* Manejo del servicio correspondiente al video.
* Manejo de la persistencia y actualizacion en la base de datos 

A continuacion se muestran las pruebas implementadas:

![](https://github.com/CAndresRa/StreamBox-BackendFinal/blob/master/ImgReadme/Test.png)

Como se utiliza MVN como gestor del proyecto mediante el comando `mvn test`obtenemos el resultado que se muestra a continuación.

![](https://github.com/CAndresRa/StreamBox-BackendFinal/blob/master/ImgReadme/mvn%20test.png)

## Trello 

https://trello.com/b/xSJo30kL/casos-de-uso-streambox



