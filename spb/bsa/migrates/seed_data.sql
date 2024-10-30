INSERT INTO
	"permission" (id, "name", created_at, updated_at)
VALUES
	(
		'cb6541f1-a32b-42aa-a6b2-1e84024fa076' :: uuid,
		'user:create',
		NOW (),
		NOW ()
	),
	(
		'728b7199-8d4b-4a2d-bd97-7b53f284091c' :: uuid,
		'user:update',
		NOW (),
		NOW ()
	),
	(
		'3008638a-ea1c-4be3-9d24-1b2ebd578bc0' :: uuid,
		'user:delete',
		NOW (),
		NOW ()
	),
	(
		'1683cbe9-8076-40da-8210-624a600e340d' :: uuid,
		'user:read',
		NOW (),
		NOW ()
	),
	(
		'2083cbe9-8072-40aa-a210-a24a600e340d' :: uuid,
		'user:list',
		NOW (),
		NOW ()
	);

INSERT INTO
	"role" (id, "name", parent_id, created_at, updated_at)
VALUES
	(
		'cc203bb9-7b33-4391-8917-0089588356f2' :: uuid,
		'admin',
		null,
		NOW (),
		NOW ()
	),
	(
		'6c8647dc-091f-4249-b9f7-12bed594d124' :: uuid,
		'client',
		'cc203bb9-7b33-4391-8917-0089588356f2' :: uuid,
		NOW (),
		NOW ()
	),
	(
		'9666740a-4ff5-4d22-830f-ab3361ba5ef4' :: uuid,
		'user',
		'6c8647dc-091f-4249-b9f7-12bed594d124' :: uuid,
		NOW (),
		NOW ()
	);

INSERT INTO
	role_permissions (role_id, permission_id)
VALUES
	(
		'cc203bb9-7b33-4391-8917-0089588356f2' :: uuid,
		'cb6541f1-a32b-42aa-a6b2-1e84024fa076' :: uuid
	),
	(
		'cc203bb9-7b33-4391-8917-0089588356f2' :: uuid,
		'728b7199-8d4b-4a2d-bd97-7b53f284091c' :: uuid
	),
	(
		'cc203bb9-7b33-4391-8917-0089588356f2' :: uuid,
		'3008638a-ea1c-4be3-9d24-1b2ebd578bc0' :: uuid
	),
	(
		'cc203bb9-7b33-4391-8917-0089588356f2' :: uuid,
		'1683cbe9-8076-40da-8210-624a600e340d' :: uuid
	),
	(
		'cc203bb9-7b33-4391-8917-0089588356f2' :: uuid,
		'2083cbe9-8072-40aa-a210-a24a600e340d' :: uuid
	),
	(
		'6c8647dc-091f-4249-b9f7-12bed594d124' :: uuid,
		'1683cbe9-8076-40da-8210-624a600e340d' :: uuid
	);

INSERT INTO
	public."user" (
		id,
		created_at,
		updated_at,
		deleted_at,
		email,
		"password",
		full_name,
		phone,
		email_verify_token,
		is_email_verified,
		role_id
	)
VALUES
	(
		'78574593-757c-49bc-aad1-3a8dd5c03970' :: uuid,
		NOW (),
		NOW (),
		NULL,
		'admin@gmail.com',
		'$2a$10$nCvN3CAF4b1mMuramtpSre8Dx7fsBf4FoRG2btotNKvbLftZPKbqu',
		NULL,
		NULL,
		NULL,
		true,
		'cc203bb9-7b33-4391-8917-0089588356f2' :: uuid
	),
	(
		'6bb9e18d-69e7-4dd3-bf7a-7b9ee15b3aeb' :: uuid,
		NOW (),
		NOW (),
		NULL,
		'client@gmail.com',
		'$2a$10$A20KBHwJ8dpuL951mY23P.D0gV6kek73rKqspLgAm2sfkCe7HgbFm',
		NULL,
		NULL,
		NULL,
		true,
		'6c8647dc-091f-4249-b9f7-12bed594d124' :: uuid
	),
	(
		'043aad47-c234-4e76-a809-d65dc5708646' :: uuid,
		NOW (),
		NOW (),
		NULL,
		'user1@gmail.com',
		'$2a$10$buwiJga6U0oGp4eim88zCuKYYFdxLz3cGgGxb9mhzuXoh3G5vpY26',
		NULL,
		NULL,
		NULL,
		false,
		'9666740a-4ff5-4d22-830f-ab3361ba5ef4' :: uuid
	);

INSERT INTO
	notification_type (
		id,
		"type",
		"title",
		"template",
		description,
		created_at,
		updated_at
	)
VALUES
	(
		gen_random_uuid(),
		'VERIFY:USER',
		'Verify Register Email',
		'<!DOCTYPE html> <html> <head> <meta charset="UTF-8" /> <meta name="viewport" content="width=device-width, initial-scale=1.0" /> <title>Email Verification</title> <link rel="preconnect" href="https://fonts.googleapis.com" /> <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin /> <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap" rel="stylesheet" /> <style> body { font-family: "Lato", sans-serif; font-weight: 400; font-style: normal; background-color: #f4f4f4; margin: 0; padding: 0; } .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); } .header { text-align: center; padding: 0; color: white; border-top-left-radius: 5px; border-top-right-radius: 5px; } .header img { width: 350px; max-height: 100%; border-top-left-radius: 5px; border-top-right-radius: 5px; } .content { text-align: center; padding: 20px; } .button { display: inline-block; padding: 10px 20px; font-size: 16px; color: white; background-color: #28a745; text-decoration: none; border-radius: 5px; margin-top: 20px; } .footer { text-align: center; padding: 20px; font-size: 12px; color: #777; } </style> </head> <body> <div class="container"><div class="content"> <h1>Hi there,</h1> <p> Thank you for registering. Please click the button below to verify your email address: </p> <a href="{{verification_link}}" class="button">Verify Email</a> <p> If you did not create an account, no further action is required. </p> </div> <div class="footer"> <p>&copy; 2024 Sport Booking. All rights reserved.</p> </div> </div> </body> </html>',
		'verify email',
		NOW(),
		NOW()
	);

INSERT INTO
	public."metadata" (
		id,
		"key",
		"value",
		created_at,
		updated_at
	)
VALUES
	(
		gen_random_uuid(),
		'operator_email',
		'hoangduc97dn@gmail.com',
		NOW(),
		NOW()
	)