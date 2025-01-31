<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

$json = file_get_contents('php://input');

// Pasamos los parámetros
$params = json_decode($json);
$usuario = $params->Usuario; // El nombre de usuario

try {
    // Conexión a la base de datos
    $mbd = new PDO('mysql:host=localhost;dbname=casino', "root", "");
    $mbd->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $mbd->beginTransaction();

    // Obtener el ID del usuario basado en el nombre de usuario
    $sentencia = $mbd->prepare("SELECT id FROM usuarios WHERE Usuario = :Usuario");
    $sentencia->bindParam(':Usuario', $usuario);
    $sentencia->execute();

    $resultado = $sentencia->fetch(PDO::FETCH_ASSOC);

    if (!$resultado) {
        // Si no se encuentra el usuario, lanzar error
        throw new Exception("Usuario no encontrado");
    }

    $Id = $resultado['id']; // Ahora obtenemos el Id del usuario

    // Eliminar el contacto asociado al usuario (Referencia a IdUsuario)
    $sentencia = $mbd->prepare("DELETE FROM contacto WHERE IdUsuario = :IdUsuario");
    $sentencia->bindParam(':IdUsuario', $Id);
    $sentencia->execute();

    // Eliminar el correo asociado al usuario (Referencia a IdUsuario)
    $sentencia = $mbd->prepare("DELETE FROM correo WHERE IdUsuario = :IdUsuario");
    $sentencia->bindParam(':IdUsuario', $Id);
    $sentencia->execute();

    // Eliminar el usuario de la tabla "usuarios"
    $sentencia = $mbd->prepare("DELETE FROM usuarios WHERE id = :Id");
    $sentencia->bindParam(':Id', $Id);
    $sentencia->execute();

    // Confirmar la transacción
    $mbd->commit();

    // Respuesta JSON exitosa
    header('Content-Type: application/json');
    echo json_encode(array('msg' => 'Usuario eliminado exitosamente'));

    // Desconexión
    $mbd = null;
} catch (PDOException $e) {
    // Manejo de errores
    if ($mbd) {
        $mbd->rollBack(); // Revertir cambios si ocurre un error
    }
    header('Content-Type: application/json');
    echo json_encode(array(
        'error' => array(
            'msg' => $e->getMessage(),
            'code' => $e->getCode()
        )
    ));
} catch (Exception $e) {
    // Manejo de errores genéricos
    if ($mbd) {
        $mbd->rollBack(); // Revertir cambios si ocurre un error
    }
    header('Content-Type: application/json');
    echo json_encode(array(
        'error' => array(
            'msg' => $e->getMessage()
        )
    ));
}