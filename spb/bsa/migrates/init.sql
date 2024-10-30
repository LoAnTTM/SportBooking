CREATE TYPE status as ENUM ('active', 'inactive');

CREATE TYPE platform as ENUM ('android', 'ios', 'inapp', 'email');

CREATE TYPE progress as ENUM ('inprogress', 'pending', 'success', 'failure');