<?php

namespace Tests\Stubs\Controllers;

use App\Http\Controllers\BasicCrudController;
use App\Models\CategoryStub;

class CategoryControllerStub extends BasicCrudController
{
   protected function model(){
        return CategoryStub::class;
   }
}
