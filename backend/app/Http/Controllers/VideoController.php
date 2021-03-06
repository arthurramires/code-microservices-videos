<?php

namespace App\Http\Controllers;

use App\Models\Video;
use App\Rules\GenresHasCategories;
use Illuminate\Http\Request;

class VideoController extends BasicCrudController
{
    private $rules;

    public function __construct()
    {   
        $this->rules = [
            'title' => 'required|max:255',
            'description' => 'required',
            'year_launched' => 'required|date_format:Y',
            'opened' => 'boolean',
            'rating' => 'required|in:' . implode(',', Video::RATING_LIST),
            'duration' => 'required|integer',
            'categories_id' => 'required|array|exists:categories,id,deleted_at,NULL',
            'genres_id' => [
                'required',
                'array',
                'exists:genres,id,deleted_at,NULL',
            ],
            'thumb_file' => 'image|max:'. Video::THUMB_FILE_MAX_SIZE,
            'banner_file' => 'image|max:'. Video::BANNER_FILE_MAX_SIZE,
            'trailer_file' => 'mimetypes:video/mp4|max:'. Video::TRAILER_FILE_MAX_SIZE,
            'video_file' => 'mimetypes:video/mp4|max:' .Video::VIDEO_FILE_MAX_SIZE,
            //'video_file' => 'required'
        ];
    }

    public function store(Request $request){
        $this->addRulesIfGenreHasCategories($request);
        $validateData = $this->validate($request, $this->rules);
        $obj = $this->model()::create($validateData);
        $obj->refresh();
        return $obj;
    }

    public function update(Request $request, $id){
        $obj = $this->findOrFail($id);
        $this->addRulesIfGenreHasCategories($request);
        $validateData = $this->validate($request, $this->rulesUpdate());
        $obj->update($validateData);
        return $obj;
    }

    public function addRulesIfGenreHasCategories(Request $request){
        $categoriesId = $request->get('categories_id');
        $categoriesId = is_array($categoriesId) ? $categoriesId : [];
        $this->rules['genres_id'][] = new GenresHasCategories(
            $categoriesId
        ); 
    }

    protected function model(){
        return Video::class;
    }

    protected function rulesStore(){
        return $this->rules;
    }

    protected function rulesUpdate(){
        return $this->rules;
    }

    protected function resourceCollection()
    {
       return $this->resource(); 
    }

    protected function resource()
    {
       return VideoResource::class; 
    }
}
