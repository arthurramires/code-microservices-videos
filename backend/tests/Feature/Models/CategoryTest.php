<?php

namespace Tests\Feature\Models;

use App\Models\Category;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CategoryTest extends TestCase
{
    use DatabaseMigrations;
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function testListCategories()
    {
       factory(Category::class, 1)->create();
       $categories = Category::all();
       $this->assertCount(1, $categories);
       $categoryKey = array_keys($categories->first()->getAttributes());
       $this->assertEqualsCanonicalizing([
           'id', 'name', 'description', 'is_active', 'created_at', 'updated_at', 'deleted_at'
       ], $categoryKey);
    }

    public function testCreate(){
        $category = Category::create([
            'name' => 'teste1'
        ]);

        $category->refresh();
        $this->assertNull($category->description);
        $this->assertTrue((bool)$category->is_active);
    }

    public function testUpdate(){
        $category = factory(Category::class)->create([
            'description' => 'teste_description',
            'is_active' => false
        ]);

        $data = [
            'name' => 'teste_updated',
            'description' => 'teste_updated',
            'is_active' => true
        ];

        $category->update($data);

        foreach ($data as $key => $value) {
            $this->assertEquals($value, $category->$key);
        }
    }

    public function testDelete(){
        $category = factory(Category::class)->create();
        $category->delete();

        $this->assertNull(Category::find($category->id));

        $category->restore();
        $this->assertNotNull(Category::find($category->id));
    }
}
