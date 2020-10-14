<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoryResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

abstract class BasicCrudController extends Controller
{

    protected $paginationSize = 15;
    protected abstract function model();
    protected abstract function rulesStore();
    protected abstract function rulesUpdate();

    protected abstract function resource();
    protected abstract function resourceCollection();

    public function index()
    {
        $data = !$this->paginationSize ? $this->model()::all() : $this->model()::paginate($this->paginationSize);
        $resourceCollectionClass = $this->resourceCollection();
        $refClass = new \ReflectionClass($this->resourceCollection());
        return $refClass->isSubclassOf(ResourceCollection::class)
            ? new $resourceCollectionClass($data)
            : $resourceCollectionClass::collection($data);

    }

    public function store(Request $request){
        $validateData = $this->validate($request, $this->rulesStore());
        $obj = $this->model()::create($validateData);
        $obj->refresh();
        $resource = $this->resource();
        return new $resource($obj);
    }

    protected function findOrFail($id){
        $model = $this->model();
        $keyName = (new $model)->getRouteKeyName();
        return $this->model()::where($keyName, $id)->firstOrFail();
    }

    public function show($id){
        $obj = $this->findOrFail($id);
        $resource = $this->resource();
        return new $resource($obj);
    }

    public function update(Request $request,$id){
        $obj = $this->findOrFail($id);
        $validateData = $this->validate($request, $this->rulesUpdate());
        $obj->update($validateData);
        $resource = $this->resource();
        return new $resource($obj);
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
