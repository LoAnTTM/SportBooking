CREATE TYPE public.status as ENUM ('active', 'inactive');

CREATE TYPE public.platform as ENUM ('android', 'ios', 'inapp', 'email');

CREATE TYPE public.progress as ENUM ('inprogress', 'pending', 'success', 'failure');