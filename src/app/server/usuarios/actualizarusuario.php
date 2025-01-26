<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header("Content-Type: application/json");

$json = file_get_contents('php://input');
$params = json_decode($json);

if (!isset($params->Usuario) || !isset($params->Passwrd) || !isset($params->Correo)) {
    echo json_encode(["error" => "Datos incompletos"]);
    exit;
}

$usuario = $params->Usuario;
$passwrd = $params->Passwrd;
$correo = $params->Correo;

try {
    $mbd = new PDO('mysql:host=localhost;dbname=casino', "root", "");
    $mbd->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Verificar si el usuario existe
    $sentencia = $mbd->prepare("SELECT Id FROM usuarios WHERE Usuario = :Usuario");
    $sentencia->bindParam(':Usuario', $usuario);
    $sentencia->execute();
    $usuarioData = $sentencia->fetch(PDO::FETCH_ASSOC);
    
    if (!$usuarioData) {
        echo json_encode(["error" => "Usuario no encontrado"]);
        exit;
    }
    
    $IdUsuario = $usuarioData['Id'];
    
    $mbd->beginTransaction();
    
    // Actualizar la contraseña (ahora se guarda sin hash)
    $sentencia = $mbd->prepare("UPDATE usuarios SET Passwrd = :Passwrd WHERE Id = :Id");
    $sentencia->bindParam(':Passwrd', $passwrd);
    $sentencia->bindParam(':Id', $IdUsuario);
    $sentencia->execute();
    
    // Actualizar el correo
    $sentencia = $mbd->prepare("UPDATE correo SET Correo = :Correo WHERE IdUsuario = :IdUsuario");
    $sentencia->bindParam(':Correo', $correo);
    $sentencia->bindParam(':IdUsuario', $IdUsuario);
    $sentencia->execute();
    
    $mbd->commit();
    echo json_encode(["msg" => "Datos actualizados exitosamente"]);
} catch (PDOException $e) {
    $mbd->rollBack();
    echo json_encode(["error" => $e->getMessage()]);
}


