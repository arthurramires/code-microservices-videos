<?php

namespace App\Models;

use App\Models\Category;
use App\Models\Genre;
use App\Models\Traits\UploadFiles;
use App\Models\Traits\Uuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Video extends Model
{
    use SoftDeletes, Uuid, UploadFiles;

    const RATING_LIST = ['L', '10', '12', '14', '16', '18'];

    protected $fillable = [
        'title',
        'description',
        'year_launched',
        'opended',
        'rating',
        'duration',
        'video_file',
        'thumb_file',
    ];

    protected $dates = ['deleted_at'];

    protected $casts = [
        'id' => 'string',
        'opened' => 'boolean',
        'year_launched' => 'integer',
        'duration' => 'integer'
    ];

    public $incrementing = false;
    public static $fileFields = ['video_file', 'thumb_file'];

    public static function create(array $attributes = []){
        $files = self::extractFiles($attributes);
        try{
            \DB::beginTransaction();
            $objeto = static::query()->create($attributes);
            static::handleRelations($objeto, $attributes);
            $objeto->uploadFiles($files);
            \DB::commit();
            return $objeto;
        }catch (\Exception $e){
            if(isset($objeto)){
                $objeto->deleteFiles($files);
            }
            \DB::rollBack();
            throw $e;
        }
    }

    public function update(array $attributes = [], array $options = []){
        $files = self::extractFiles($attributes);
        try{
            \DB::beginTransaction();
            $saved = parent::update($attributes, $options);
            static::handleRelations($this, $attributes);
            if($saved){
                $this->uploadFiles($files);
            }
            \DB::commit();
            if($saved && count($files)){
                $this->deleteOldFiles();   
            }
            return $saved;
        }catch (\Exception $e){
            if(isset($saved)){
                $this->deleteFiles($files);
            }
            \DB::rollBack();
            throw $e;
        }
    }

    protected static function handleRelations(Video $video, array $attributes){
        if(isset($attributes['categories_id'])){
            $video->categories()->sync($attributes['categories_id']);
        }
        if(isset($attributes['genres_id'])){
            $video->genres()->sync($attributes['genres_id']);
        }
        
    }

    public function categories(){
        return $this->belongsToMany(Category::class)->withTrashed();
    }

    public function genres(){
        return $this->belongsToMany(Genre::class)->withTrashed();
    }

    protected function uploadDir()
    {
        return $this->id;
    }
}
