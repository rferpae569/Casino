<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

$json = file_get_contents('php://input');
$params = json_decode($json);

$nombreUsuario = $params->NombreUsuario;  // Nombre de usuario
$correoUsuario = $params->CorreoUsuario;  // Correo proporcionado en el formulario
$razon = $params->Razon;  // Razón del contacto
$telefono = $params->Telefono;  // Teléfono
$mensaje = $params->Mensaje;  // Mensaje

try {
    $mbd = new PDO('mysql:host=localhost;dbname=casino', "root", "");
    $mbd->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Buscar el IdUsuario en la base de datos
    $sentencia = $mbd->prepare("SELECT id FROM usuarios WHERE Usuario = :nombreUsuario");
    $sentencia->bindParam(':nombreUsuario', $nombreUsuario);
    $sentencia->execute();
    $usuario = $sentencia->fetch(PDO::FETCH_ASSOC);

    if (!$usuario) {
        echo json_encode(array('error' => 'Usuario no encontrado.'));
        exit;
    }

    $idUsuario = $usuario['id'];  // ID del usuario registrado en la base de datos

    // Insertar el mensaje con el correo proporcionado en el formulario
    $sentencia = $mbd->prepare("INSERT INTO contacto (IdUsuario, NombreUsuario, CorreoUsuario, Razon, Telefono, Mensaje) 
                                VALUES (:idUsuario, :nombreUsuario, :correoUsuario, :razon, :telefono, :mensaje)");

    $sentencia->bindParam(':idUsuario', $idUsuario);
    $sentencia->bindParam(':nombreUsuario', $nombreUsuario);
    $sentencia->bindParam(':correoUsuario', $correoUsuario);  // Se usa el correo del formulario, no el de la BD
    $sentencia->bindParam(':razon', $razon);
    $sentencia->bindParam(':telefono', $telefono);
    $sentencia->bindParam(':mensaje', $mensaje);

    $sentencia->execute();

    // Respuesta JSON exitosa
    header('Content-Type: application/json');
    echo json_encode(array('msg' => 'Mensaje enviado correctamente.'));

    // Cerrar conexión
    $mbd = null;
} catch (PDOException $e) {
    // Manejo de errores
    header('Content-Type: application/json');
    echo json_encode(array(
        'error' => array(
            'msg' => $e->getMessage(),
            'code' => $e->getCode()
        )
    ));
}

