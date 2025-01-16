<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

$json = file_get_contents('php://input');

// Pasamos los parámetros
$params = json_decode($json);
$usuario = $params->Usuario; // El nombre de usuario
$passwrd = $params->Passwrd; // La contraseña
$fechaNacimiento = $params->FechaNacimiento; // La fecha de nacimiento
$correo = $params->Correo; // El correo

try {
    // Conexión a la base de datos
    $mbd = new PDO('mysql:host=localhost;dbname=casino', "root", "");
    $mbd->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $mbd->beginTransaction();
    
    // Insertar el usuario en la tabla "usuarios"
    $sentencia = $mbd->prepare("INSERT INTO usuarios (Usuario, Passwrd, FechaNacimiento) VALUES (:Usuario, :Passwrd, :FechaNacimiento)");
    $sentencia->bindParam(':Usuario', $usuario);
    $sentencia->bindParam(':Passwrd', $passwrd);
    $sentencia->bindParam(':FechaNacimiento', $fechaNacimiento);

    $sentencia->execute();
    
    // Obtener el último ID generado (el id del usuario recién insertado)
    $IdUsuario = $mbd->lastInsertId();

    // Insertar el correo en la tabla "correos" asociado al id del usuario
    $sentencia = $mbd->prepare("INSERT INTO correo (Correo, IdUsuario) VALUES (:Correo, :IdUsuario)");
    $sentencia->bindParam(':Correo', $correo);
    $sentencia->bindParam(':IdUsuario', $IdUsuario);

    $sentencia->execute();
    
    // Confirmar la transacción
    $mbd->commit();
    
    // Respuesta JSON exitosa
    header('Content-Type: application/json');
    echo json_encode(array('msg' => 'Usuario creado exitosamente'));
    
    // Desconexión
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
