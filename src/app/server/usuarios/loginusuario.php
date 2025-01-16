<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

$json = file_get_contents('php://input');
$params = json_decode($json);

try {    
    $mbd = new PDO('mysql:host=localhost;dbname=casino', "root", "");
    // Conexión a la base de datos mediante PDO

    // Consulta con INNER JOIN para unir las tablas usuarios y correo
    $sentencia = $mbd->prepare("
        SELECT u.* 
        FROM usuarios u
        INNER JOIN correo c ON u.Id = c.IdUsuario
        WHERE c.Correo = :correo AND u.Passwrd = :passwrd
    ");

    $sentencia->bindParam(':correo', $correo);
    $sentencia->bindParam(':passwrd', $passwrd);

    $correo = $params->Correo; // Obtenemos el correo del cliente
    $passwrd = $params->Passwrd; // Obtenemos la contraseña del cliente

    $sentencia->execute();
    $error = $sentencia->errorInfo();
    header('Content-Type: application/json');

    if ($sentencia->errorCode() == 0) {
        $rows = $sentencia->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($rows); // Devuelve los datos del usuario si hay coincidencias
    } else {
        echo json_encode(['error' => $error]);
    }

    $mbd = null; // Cerramos la conexión
} catch (PDOException $e) {
    header('Content-Type: application/json');
    echo json_encode(array(
        'error' => array(
            'msg' => $e->getMessage(),
            'code' => $e->getCode()
        )
    ));
}