<?php

namespace Tests\Feature\Http\Controllers\Api;
use App\Models\CategoryStub;
use Illuminate\Validation\ValidationException;
use Test\Stubs\Models\CategoryStub as ModelsCategoryStub;
use Tests\Stubs\Controllers\CategoryControllerStub;

class BasicCrudControllerTest extends TestCase
{
    
    protected function setUp(): void{
        parent::setUp();
        CategoryStub::createTable();
        $this->controller = new CategoryControllerStub();
    }

    protected function tearDown(): void{
        CategoryStub::dropTable();
        parent::tearDown();
    }

    public function testIndex(){
        $category = CategoryStub::create(['name' => 'test_name', 'description' => 'test_description']);
        $result = $this->controller->index()->toArray();

        $this->assertEquals([$category->toArray()], $result);
    }

    public function testInvalidationDataInStore(){
        $this->expectException(ValidationException::class);
        $request = \Mockery::mock(Request::class);

        $request
            ->shouldReceive('all')
            ->once()
            ->andReturn(['name' => '']);

        $this->controller->store($request);
    }

    public function testStore(){
        $this->expectException(ValidationException::class);
        $request = \Mockery::mock(Request::class);

        $request
            ->shouldReceive('all')
            ->once()
            ->andReturn(['name' => 'test_name', 'description' => 'test_description']);

        $obj = $this->controller->store($request);

        $this->assertEquals(
            CategoryStub::find(1)->toArray(),
            $obj->toArray()
        );
    }
}