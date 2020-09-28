<?php

namespace Tests\Feature\Http\Controllers\Api;
use App\Models\Video;
use Tests\Traits\TestValidations;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\Traits\TestSaves;

class VideoControllerTest extends TestCase
{
    
    use DatabaseMigrations, TestValidations, TestSaves;

    private $video;
    /**
     * A basic feature test example.
     *
     * @return void
     */

    protected function setUp(): void{
        parent::setUp();
        $this->video = factory(Video::class)->create();
    }

    public function testIndex()
    {
        $response = $this->get(route('videos.index'));

        $response
            ->assertStatus(200)
            ->assertJson([$this->video->toArray()]);
    }

    public function testShow()
    {
        $response = $this->get(route('videos.show', ['video' => $this->video->id]));

        $response
            ->assertStatus(200)
            ->assertJson([$this->video->toArray()]);
    }

    // public function testInvalidationData()
    // {
    //     $data = [
    //         'title' => '',
    //         'description' => '',
    //         'year_launched' => '',
    //         'rating' => '',
    //         'duration' => '',
    //     ];

    //     $this->assertInvalidationInStoreAction($data, 'required');
    //     $this->assertInvalidationInUpdateAction($data, 'required');
    // }

    public function testInvalidationRequired()
    {
        $data = [
            'title' => '',
            'description' => '',
            'year_launched' => '',
            'rating' => '',
            'duration' => '',
        ];

        $this->assertInvalidationInStoreAction($data, 'required');
        $this->assertInvalidationInUpdateAction($data, 'required');
    }

    public function testInvalidationMax()
    {
        $data = [
            'title' => str_repeat('a', 255),
        ];

        $this->assertInvalidationInStoreAction($data, 'max.string', ['max' => 255]);
        $this->assertInvalidationInUpdateAction($data, 'max.string', ['max' => 255]);
    }

    public function testInvalidationInteger()
    {
        $data = [
            'duration' => 's',
        ];

        $this->assertInvalidationInStoreAction($data, 'integer');
        $this->assertInvalidationInUpdateAction($data, 'integer');
    }

    public function testInvalidationYearLauchedField()
    {
        $data = [
            'year_lauched' => 'a',
        ];

        $this->assertInvalidationInStoreAction($data, 'date_format', ['format' => 'Y']);
        $this->assertInvalidationInUpdateAction($data, 'date_format', ['format' => 'Y']);
    }

    public function testInvalidationOpenedField()
    {
        $data = [
            'opened' => 's',
        ];

        $this->assertInvalidationInStoreAction($data, 'boolean');
        $this->assertInvalidationInUpdateAction($data, 'boolean');
    }

    public function testInvalidationRatingField()
    {
        $data = [
            'rating' => 0,
        ];

        $this->assertInvalidationInStoreAction($data, 'in');
        $this->assertInvalidationInUpdateAction($data, 'in');
    }

    public function testStore()
    {
        $data = [
            'name' => 'teste'
        ];

        $response = $this->assertStore($data, $data + ['description' => null, 'is_active' => true, 'deleted_at' => null]);
        
        $response->assertJsonStructure([
            'created_at', 
            'updated_at'
        ]);

        $data = [
            'name' => 'teste',
            'description' => 'description',
            'is_active' => false
        ];

        $this->assertStore($data, $data + ['description' => 'description', 'is_active' => false]);

    }

    public function testUpdate(){
        $this->category = factory(Category::class)->create([
            'is_active' => false
        ]);

        $data = [
            'name' => 'test',
            'is_active' => true,
            'description' => 'test'
        ];
        $response = $this->assertUpdate($data, $data + ['deleted_at' => null]);
        $response->assertJsonStructure([
            'created_at', 
            'updated_at'
        ]);

        $data = [
            'name' => 'test',
            'description' => ''
        ];
        $this->assertUpdate($data, array_merge($data, ['description' => null]));

        $data['description'] = 'test';
        $this->assertUpdate($data, array_merge($data, ['description' => 'test']));

        $data['description'] = null;
        $this->assertUpdate($data, array_merge($data, ['description' => null]));
    }

    public function testDestroy(){
        $response = $this->json('DELETE', route('categories.destroy', ['category' => $this->category->id]));
        $response->assertStatus(204);
        $this->assertNull(Category::find($this->category->id));
        $this->assertNotNull(Category::withTrashed()->find($this->category->id));
    }

    protected function routeStore(){
        return route('videos.store');
    }
    protected function routeUpdate(){
        return route('videos.update', ['video' => $this->video->id]);
    }

    protected function model(){
        return Video::class;
    }
}
