<?php

namespace Tests\Feature\Http\Controllers\Api;
use App\Models\Genre;
use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CategoryControllerTest extends TestCase
{
    use DatabaseMigrations;
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function testIndex()
    {
        $genre = factory(Genre::class)->create();
        $response = $this->get(route('genres.index'));

        $response->assertStatus(200)->assertJson([$genre->toArray()]);
    }

    public function testShow()
    {
        $genre = factory(Genre::class)->create();
        $response = $this->get(route('genres.show', ['genre' => $genre->id]));

        $response->assertStatus(200)->assertJson([$genre->toArray()]);
    }

    public function testInvalidationData()
    {
        $response = $this->json('POST', route('genres.store'), []);

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors(['name'])
    }

    public function testStore()
    {
        $response = $this->json('POST', route('genres.store'), [
            'name' => 'test',

        ]);

        $id = $response->json('id');
        $genre = Genre::find($id);

        $response
             ->assertStatus(201)
             ->assertJson($genre->toArray());
    }

    public function testUpdate(){
        $genre = factory(Genre::class)->create([
            'is_active' => false
        ]);
        $response = $this->json('PUT', route('genres.update', ['genre' => $genre->id]),
        [
            'name' => 'test',
            'is_active' => true,
        ]);

        $id = $response->json('id');
        $genre = Genre::find($id);

        $response
            ->assertStatus(200)
            ->assertJson($genre->toArray());
    }

    public function testDestroy(){
        $genre = factory(Genre::class)->create();
        $response = $this->json('DELETE', route('genres.destroy', ['genre' => $genre->id]));
        $response->assertStatus(204);
        $this->assertNull(Category::find($genre->id));
        $this->assertNotNull(Category::withTrashed()->find($genre->id));
    }
}
