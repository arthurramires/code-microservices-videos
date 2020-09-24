<?php

namespace Tests\Feature\Http\Controllers\Api;
use App\Models\CategoryStub;
use Tests\Stubs\Controllers\CategoryControllerStub;

class BasicCrudControllerTest extends TestCase
{
    
    protected function setUp(): void{
        parent::setUp();
        CategoryStub::createTable();
    }

    protected function tearDown(): void{
        CategoryStub::dropTable();
        parent::tearDown();
    }

    public function testIndex(){
        $category = CategoryStub::create(['name' => 'test_name', 'description' => 'test_description']);
        $controller = new CategoryControllerStub();
        $result = $controller->index()->toArray();

        $this->assertEquals([$category->toArray()], $result);
    }
}
