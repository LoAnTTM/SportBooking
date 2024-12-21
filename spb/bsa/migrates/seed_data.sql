INSERT INTO
	"permission" (id, "name", created_at, updated_at)
VALUES
	(1, 'user:list', NOW(), NOW()),
	(2, 'user:read', NOW(), NOW()),
	(4, 'user:create', NOW(), NOW()),
	(8, 'user:update', NOW(), NOW()),
	(16, 'user:delete', NOW(), NOW()),
	(32, 'unit_service:create', NOW(), NOW()),
	(64, 'unit_service:update', NOW(), NOW()),
	(128, 'unit_service:delete', NOW(), NOW()),
	(256, 'club:create', NOW(), NOW()),
	(512, 'club:update', NOW(), NOW()),
	(1024, 'club:delete', NOW(), NOW()),
	(2048, 'unit:create', NOW(), NOW()),
	(4096, 'unit:update', NOW(), NOW()),
	(8192, 'unit:delete', NOW(), NOW()),
	(16384, 'location:create', NOW(), NOW()),
	(32768, 'location:update', NOW(), NOW()),
	(65536, 'location:delete', NOW(), NOW()),
	(131072, 'metadata:create', NOW(), NOW()),
	(262144, 'metadata:read', NOW(), NOW()),
	(524288, 'order:list', NOW(), NOW()),
	(1048576, 'order:read', NOW(), NOW()),
	(2097152, 'order:create', NOW(), NOW()),
	(4194304, 'order:approve_request', NOW(), NOW()),
	(8388608, 'order:approve_payment', NOW(), NOW());

INSERT INTO
	"role" (
		id,
		"name",
		permission_bit,
		parent_id,
		created_at,
		updated_at
	)
VALUES
	(
		'cc203bb9-7b33-4391-8917-0089588356f2' :: uuid,
		'admin',
		16777215,
		null,
		NOW (),
		NOW ()
	),
	(
		'6c8647dc-091f-4249-b9f7-12bed594d124' :: uuid,
		'client',
		11567079,
		'cc203bb9-7b33-4391-8917-0089588356f2' :: uuid,
		NOW (),
		NOW ()
	),
	(
		'9666740a-4ff5-4d22-830f-ab3361ba5ef4' :: uuid,
		'user',
		3670016,
		'6c8647dc-091f-4249-b9f7-12bed594d124' :: uuid,
		NOW (),
		NOW ()
	);

INSERT INTO
	role_permissions (role_id, permission_id)
VALUES
	(
		'cc203bb9-7b33-4391-8917-0089588356f2' :: uuid,
		1
	),
	(
		'cc203bb9-7b33-4391-8917-0089588356f2' :: uuid,
		2
	),
	(
		'cc203bb9-7b33-4391-8917-0089588356f2' :: uuid,
		4
	),
	(
		'cc203bb9-7b33-4391-8917-0089588356f2' :: uuid,
		8
	),
	(
		'cc203bb9-7b33-4391-8917-0089588356f2' :: uuid,
		16
	),
	(
		'cc203bb9-7b33-4391-8917-0089588356f2' :: uuid,
		32
	),
	(
		'cc203bb9-7b33-4391-8917-0089588356f2' :: uuid,
		64
	),
	(
		'cc203bb9-7b33-4391-8917-0089588356f2' :: uuid,
		128
	),
	(
		'cc203bb9-7b33-4391-8917-0089588356f2' :: uuid,
		256
	),
	(
		'cc203bb9-7b33-4391-8917-0089588356f2' :: uuid,
		512
	),
	(
		'cc203bb9-7b33-4391-8917-0089588356f2' :: uuid,
		1024
	),
	(
		'cc203bb9-7b33-4391-8917-0089588356f2' :: uuid,
		2048
	),
	(
		'cc203bb9-7b33-4391-8917-0089588356f2' :: uuid,
		4096
	),
	(
		'cc203bb9-7b33-4391-8917-0089588356f2' :: uuid,
		8192
	),
	(
		'cc203bb9-7b33-4391-8917-0089588356f2' :: uuid,
		16384
	),
	(
		'cc203bb9-7b33-4391-8917-0089588356f2' :: uuid,
		32768
	),
	(
		'cc203bb9-7b33-4391-8917-0089588356f2' :: uuid,
		65536
	),
	(
		'cc203bb9-7b33-4391-8917-0089588356f2' :: uuid,
		131072
	),
	(
		'cc203bb9-7b33-4391-8917-0089588356f2' :: uuid,
		262144
	),
	(
		'cc203bb9-7b33-4391-8917-0089588356f2' :: uuid,
		524288
	),
	(
		'cc203bb9-7b33-4391-8917-0089588356f2' :: uuid,
		1048576
	),
	(
		'cc203bb9-7b33-4391-8917-0089588356f2' :: uuid,
		2097152
	),
	(
		'cc203bb9-7b33-4391-8917-0089588356f2' :: uuid,
		4194304
	),
	(
		'cc203bb9-7b33-4391-8917-0089588356f2' :: uuid,
		8388608
	),
	(
		'6c8647dc-091f-4249-b9f7-12bed594d124' :: uuid,
		1
	),
	(
		'6c8647dc-091f-4249-b9f7-12bed594d124' :: uuid,
		2
	),
	(
		'6c8647dc-091f-4249-b9f7-12bed594d124' :: uuid,
		4
	),
	(
		'6c8647dc-091f-4249-b9f7-12bed594d124' :: uuid,
		32
	),
	(
		'6c8647dc-091f-4249-b9f7-12bed594d124' :: uuid,
		64
	),
	(
		'6c8647dc-091f-4249-b9f7-12bed594d124' :: uuid,
		128
	),
	(
		'6c8647dc-091f-4249-b9f7-12bed594d124' :: uuid,
		256
	),
	(
		'6c8647dc-091f-4249-b9f7-12bed594d124' :: uuid,
		512
	),
	(
		'6c8647dc-091f-4249-b9f7-12bed594d124' :: uuid,
		1024
	),
	(
		'6c8647dc-091f-4249-b9f7-12bed594d124' :: uuid,
		2048
	),
	(
		'6c8647dc-091f-4249-b9f7-12bed594d124' :: uuid,
		4096
	),
	(
		'6c8647dc-091f-4249-b9f7-12bed594d124' :: uuid,
		8192
	),
	(
		'6c8647dc-091f-4249-b9f7-12bed594d124' :: uuid,
		16384
	),
	(
		'6c8647dc-091f-4249-b9f7-12bed594d124' :: uuid,
		1048576
	),
	(
		'6c8647dc-091f-4249-b9f7-12bed594d124' :: uuid,
		2097152
	),
	(
		'6c8647dc-091f-4249-b9f7-12bed594d124' :: uuid,
		8388608
	),
	(
		'9666740a-4ff5-4d22-830f-ab3361ba5ef4' :: uuid,
		524288
	),
	(
		'9666740a-4ff5-4d22-830f-ab3361ba5ef4' :: uuid,
		1048576
	),
	(
		'9666740a-4ff5-4d22-830f-ab3361ba5ef4' :: uuid,
		2097152
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
		'A:VE:',
		'Sport Booking - Email Address Verification Request',
		'<!DOCTYPE html> <html> <head> <meta charset="UTF-8" /> <meta name="viewport" content="width=device-width, initial-scale=1.0" /> <title>Email Verification</title> <link rel="preconnect" href="https://fonts.googleapis.com" /> <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin /> <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap" rel="stylesheet" /> <style> body { font-family: "Lato", sans-serif; font-weight: 400; font-style: normal; background-color: #f4f4f4; margin: 0; padding: 0; } .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); } .content { text-align: left; padding: 20px; } .center { display: flex; justify-content: center; margin: 30px 0; } .button { display: inline-block; padding: 10px 20px; font-size: 16px; color: white; background-color: #28a745; text-decoration: none; border-radius: 5px; } .footer { text-align: center; padding: 20px; font-size: 12px; color: #777; } </style> </head> <body> <div class="container"> <div class="content"> <h1>Hi, {{.Name}}</h1> <p>Thank you for registering at {{.CompanyName}}! <br /></p> <p> To complete your registration, please verify your email address by clicking the link below: </p> <div class="center"> <a href="{{.VerificationLink}}" class="button" >Verify My Email</a > </div> <p> If you didn’t sign up for an account, please ignore this email. </p> <p>Thank you,</p> <p>{{.CompanyName}} Team</p> </div> <div class="footer"> <p>&copy; 2024 Sport Booking. All rights reserved.</p> </div> </div> </body> </html>',
		'verify email',
		NOW(),
		NOW()
	),
	(
		gen_random_uuid(),
		'A:RP:',
		'Sport Booking - Reset Your Password',
		'<!DOCTYPE html> <html> <head> <meta charset="UTF-8" /> <meta name="viewport" content="width=device-width, initial-scale=1.0" /> <title>Email Verification</title> <link rel="preconnect" href="https://fonts.googleapis.com" /> <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin /> <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap" rel="stylesheet" /> <style> body { font-family: "Lato", sans-serif; font-weight: 400; font-style: normal; background-color: #f4f4f4; margin: 0; padding: 0; } .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); } .content { text-align: left; padding: 20px; } .center { display: flex; justify-content: center; margin: 30px 0; } .button { display: inline-block; padding: 10px 20px; font-size: 16px; color: white; background-color: #28a745; text-decoration: none; border-radius: 5px; } .footer { text-align: center; padding: 20px; font-size: 12px; color: #777; } </style> </head> <body> <div class="container"> <div class="content"> <h1>Hi, {{.Name}}</h1> <p> We received a request to reset your password for your {{.CompanyName}} account. <br /> </p> <p>To reset your password, <b>click the link below:</b></p> <div class="center"> <a href="{{.VerificationLink}}" class="button" >Reset My Password</a > </div> <p> If you did not request a password reset, please ignore this email. Your password will remain unchanged. </p> <p>Thank you,</p> <p>{{.CompanyName}} Team</p> <hr /> <i>This link will expire in <b>{{.Expire}}</b>.</i> </div> <div class="footer"> <p>&copy; 2024 Sport Booking. All rights reserved.</p> </div> </div> </body> </html>',
		'reset password',
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
	);