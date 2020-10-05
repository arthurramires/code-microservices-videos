<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;

abstract class BasicCrudController extends Controller
{

    protected abstract function model();
    protected abstract function rulesStore();
    protected abstract function rulesUpdate();

    public function index()
    {
        return $this->model()::all();
    }

    public function store(Request $request){
        $validateData = $this->validate($request, $this->rulesStore());
        $obj = $this->model()::create($validateData);
        $obj->refresh();

        return $obj;
    }

    protected function findOrFail($id){
        $model = $this->model();
        $keyName = (new $model)->getRouteKeyName();
        return $this->model()::where($keyName, $id)->firstOrFail();
    }

    public function show($id){
        $obj = $this->findOrFail($id);
        return $obj;
    }

    public function update(Request $request,$id){
        $obj = $this->findOrFail($id);
        $validateData = $this->validate($request, $this->rulesUpdate());
        $obj->update($validateData);
        return $obj;
    }

    public function destroy($id){
        $obj = $this->findOrFail($id);
        $obj->delete();

        return response()->noContent();
    }


    // public function store(Request $request)
    // {
    //     $this->validate($request, $this->rules);
    //     return Category::create($request->all());
    //     $category->refresh();
    //     return $category;
    // }


    // public function show(Category $category)
    // {
    //     return $category;
    // }


    // public function update(Request $request, Category $category)
    // {
    //     $this->validate($request, $this->rules);
    //     $category->update($request->all());
    //     return $category;
    // }


    // public function destroy(Category $category)
    // {
    //     $category->delete();
    //     return response()->noContent();
    // }
}
