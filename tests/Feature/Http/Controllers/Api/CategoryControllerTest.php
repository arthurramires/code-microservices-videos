<?php

namespace Tests\Feature\Http\Controllers\Api;
use App\Models\Category;
use Tests\Traits\TestValidations;
use Illuminate\Foundation\Testing\DatabaseMigrations;


class CategoryControllerTest extends TestCase
{
    
    use DatabaseMigrations, TestValidations;

    private $category;
    /**
     * A basic feature test example.
     *
     * @return void
     */

    protected function setUp(): void{
        parent::setUp();
        $this->category = factory(Category::class)->create();
    }

    public function testIndex()
    {
        $response = $this->get(route('categories.index'));

        $response
            ->assertStatus(200)
            ->assertJson([$this->categorys->toArray()]);
    }

    public function testShow()
    {
        $response = $this->get(route('categories.show', ['category' => $this->category->id]));

        $response
            ->assertStatus(200)
            ->assertJson([$this->category->toArray()]);
    }

    public function testInvalidationData()
    {
        $data = [
            'name' => ''
        ];

        $this->assertInvalidationInStoreAction($data, 'required');
        $this->assertInvalidationInUpdateAction($data, 'required');

        $data = [
            'name' => str_repeat('a', 256),
        ];

        $this->assertInvalidationInStoreAction($data, 'max.string', ['max' => 255]);
        $this->assertInvalidationInUpdateAction($data, 'max.string', ['max' => 255]);

        $data = [
            'is_active' => 'a'
        ];

        $this->assertInvalidationInStoreAction($data, 'boolean');
        $this->assertInvalidationInUpdateAction($data, 'boolean');

    }

    public function testStore()
    {
        $response = $this->json('POST', route('categories.store'), [
            'name' => 'test',

        ]);

        $id = $response->json('id');
        $this->category = Category::find($id);

        $response
             ->assertStatus(201)
             ->assertJson($this->category->toArray());
        $this->assertTrue($response->json('is_active'));
    }

    public function testUpdate(){
        $category = factory(Category::class)->create([
            'is_active' => false
        ]);
        $response = $this->json('PUT', route('categories.update', ['category' => $category->id]),
        [
            'name' => 'test',
            'is_active' => true,
            'description' => 'test'
        ]);

        $id = $response->json('id');
        $category = Category::find($id);

        $response
            ->assertStatus(200)
            ->assertJson($category->toArray());
    }

    public function testDestroy(){
        $response = $this->json('DELETE', route('categories.destroy', ['category' => $this->category->id]));
        $response->assertStatus(204);
        $this->assertNull(Category::find($this->category->id));
        $this->assertNotNull(Category::withTrashed()->find($this->category->id));
    }

    protected function routeStore(){
        return route('categories.store');
    }
    protected function routeUpdate(){
        return route('categories.update', ['category' => $this->category->id]);
    }
}
