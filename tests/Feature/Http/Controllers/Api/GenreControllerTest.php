<?php

namespace Tests\Feature\Http\Controllers\Api;
use App\Models\Genre;
use Tests\TestCase;
use Tests\Traits\TestValidations;

use Illuminate\Foundation\Testing\TestResponse;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CategoryControllerTest extends TestCase
{
    use DatabaseMigrations, TestValidations;
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function testIndex()
    {
        $genre = factory(Genre::class)->create();
        $response = $this->get(route('genres.index'));

        $response
            ->assertStatus(200)
            ->assertJson([$genre->toArray()]);
    }

    public function testShow()
    {
        $genre = factory(Genre::class)->create();
        $response = $this->get(route('genres.show', ['genre' => $genre->id]));

        $response
            ->assertStatus(200)
            ->assertJson([$genre->toArray()]);
    }

    public function testInvalidationData()
    {
        $response = $this->json('POST', route('genres.store'), []);
        $this->assertInvalidationRequired($response);

        $response = $this->json('POST'. route('genres.store'), [
            'name' => str_repeat('a', 256),
            'is_active' => 'a'
        ]);

        $this->assertInvalidationMax($response);
        $this->assertInvalidationBoolean($response);

        $genre = factory(Genre::class)->create();
        $response = $this->json('PUT', 'genres.update', [
            'genre' => $genre->id
        ]);
        $this->assertInvalidationRequired($response);
    }

    protected function assertInvalidationRequired(TestResponse $response){
        $this->assertInvalidationFields($response, ['name'], 'required', []);
        $response 
            ->assertJsonMissingValidationErrors(['is_active']);
    }
    protected function assertInvalidationMax(TestResponse $response){
        $this->assertInvalidationFields($response, ['name'], 'max.string', ['max' => 255]);
    }
    protected function assertInvalidationBoolean(TestResponse $response){
        $this->assertInvalidationFields($response, ['is_active'], 'boolean', []);
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
        $this->assertTrue($response->json('is_active'));
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
        $this->assertNull(Genre::find($genre->id));
        $this->assertNotNull(Genre::withTrashed()->find($genre->id));
    }
}
