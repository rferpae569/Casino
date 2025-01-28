<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

$json = file_get_contents('php://input');

// Pasamos los parámetros del JSON
$params = json_decode($json);
$razon = $params->Razon; // La razón
$telefono = $params->Telefono; // El teléfono
$mensaje = $params->Mensaje; // El mensaje
$correo = $params->CorreoUsuario; // Aquí usamos 'CorreoUsuario'

// Conexión a la base de datos
try {
    $mbd = new PDO('mysql:host=localhost;dbname=casino', "root", "");
    $mbd->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $mbd->beginTransaction();
    
    // Buscar el idUsuario correspondiente al correo
    $sentencia = $mbd->prepare("SELECT idUsuario FROM correo WHERE Correo = :Correo");
    $sentencia->bindParam(':Correo', $correo);  // Correo de la tabla correo
    $sentencia->execute();
    
    $resultado = $sentencia->fetch(PDO::FETCH_ASSOC);
    
    if ($resultado) {
        // Si se encuentra el correo, obtenemos el idUsuario
        $idUsuario = $resultado['idUsuario'];

        // Insertar en la tabla contacto
        $sentencia = $mbd->prepare("INSERT INTO contacto (razon, telefono, mensaje, idUsuario, CorreoUsuario) VALUES (:Razon, :Telefono, :Mensaje, :IdUsuario, :CorreoUsuario)");
        $sentencia->bindParam(':Razon', $razon);
        $sentencia->bindParam(':Telefono', $telefono);
        $sentencia->bindParam(':Mensaje', $mensaje);
        $sentencia->bindParam(':IdUsuario', $idUsuario);
        $sentencia->bindParam(':CorreoUsuario', $correo);  

        $sentencia->execute();
        
        // Confirmar la transacción
        $mbd->commit();
        
        // Respuesta JSON exitosa
        header('Content-Type: application/json');
        echo json_encode(array('msg' => 'Contacto registrado exitosamente'));
    } else {
        // Si no se encuentra el correo, devolver un error
        header('Content-Type: application/json');
        echo json_encode(array('error' => 'Correo no registrado'));
    }
    
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

