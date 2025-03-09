<?php

namespace Drupal\drag_and_drop_files\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 *
 * @author stephane
 *        
 */
class UploadController extends ControllerBase {
  
  /**
   * Build the Styled image.
   */
  public function getImageUrl($fid) {
    $file = \Drupal\file\Entity\File::load($fid);
    $datas = [];
    if ($file) {
      // $datas = $file->toArray();
      $datas['filename'] = $file->getFilename();
      $datas['url'] = \Drupal::service('file_system')->realpath($file->getFileUri());
    }
    //
    return new JsonResponse($datas);
  }
  
  /**
   *
   * @param Request $request
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   */
  public function handleUpload(Request $request) {
    $file = $request->files->get('file');
    $error = [];
    if ($file->getSize() > 40 * 1024 * 1024) { // 40 Mo
      $error[] = 'Le fichier est trop volumineux.';
    }
    if (empty($error)) {
      // Enregistrez le fichier dans le système Drupal
      $destination = 'public://dnd-uploads/';
      \Drupal::service('file_system')->prepareDirectory($destination, \Drupal\Core\File\FileSystemInterface::CREATE_DIRECTORY);
      
      $file_entity = \Drupal\file\Entity\File::create(
        [
          'uid' => \Drupal::currentUser()->id(),
          'filename' => $file->getClientOriginalName(),
          'uri' => $destination . $file->getClientOriginalName(),
          'status' => 0 // pendant la phase de test.
        ]);
      
      $file_entity->save();
      // Déplacez le fichier temporaire vers la destination finale
      move_uploaded_file($file->getRealPath(), $file_entity->getFileUri());
      return new JsonResponse([
        'fid' => $file_entity->id(),
        'url' => \Drupal::service('file_url_generator')->generateAbsoluteString($file_entity->getFileUri()),
        'filename' => $file_entity->getFilename()
      ]);
    }
    return new JsonResponse([
      'errors' => $error
    ], 400);
  }
}