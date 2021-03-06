<?php

namespace App\ModelFilters;

use App\Models\CastMember;
use EloquentFilter\ModelFilter;

class CastMemberFilter extends DefaultModelFilter
{
    protected $sortable = ['name', 'type', 'created_at'];

    public function search($search)
    {
        $this->where('name', 'LIKE', "%$search%");
    }

    public function type($type)
    {
        $type_ = (int)$type;
        if(in_array($type, CastMember::$types)){
            $this->where('type', (int)$type);
        }
    }
}
