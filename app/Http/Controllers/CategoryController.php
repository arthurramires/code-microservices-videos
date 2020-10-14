<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends BasicCrudController
{

    private $rules = [
        'name' => 'required|max:255',
        'description' => 'nullable',
        'is_active' => 'boolean'
    ];

    // public function show($id){
    //     $obj = parent::show($id);
    //     return new CategoryResource($obj);
    // }
    protected function model(){
        return Category::class;
    }

    protected function rulesStore(){
        return $this->rules;
    }

    protected function rulesUpdate(){
        return $this->rules;
    }

    protected function resource()
    {
       return CategoryResource::class; 
    }
}
