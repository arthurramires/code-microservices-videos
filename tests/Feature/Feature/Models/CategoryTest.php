<?php

namespace Tests\Feature\Feature\Models;

use App\Models\Category;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\Database\DatabaseMigrations;
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

        $this->assertEquals('test1', $category->name);
        $this->assertNull($category->description);
        $this->assertTrue((bool)$category->is_active);
    }
}
