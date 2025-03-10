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
	(131072, 'metadata:read', NOW(), NOW()),
	(262144, 'metadata:create', NOW(), NOW()),
	(524288, 'metadata:update', NOW(), NOW()),
	(1048576, 'order:club:list', NOW(), NOW()),
	(2097152, 'order:club:read', NOW(), NOW()),
	(4194304, 'order:create', NOW(), NOW()),
	(8388608, 'order:approve_request', NOW(), NOW()),
	(16777216, 'order:approve_payment', NOW(), NOW()),
	(33554432, 'sport_type:create', NOW(), NOW()),
	(67108864, 'sport_type:update', NOW(), NOW()),
	(134217728, 'sport_type:delete', NOW(), NOW());

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
		268435455,
		null,
		NOW (),
		NOW ()
	),
	(
		'6c8647dc-091f-4249-b9f7-12bed594d124' :: uuid,
		'client',
		28327904,
		'cc203bb9-7b33-4391-8917-0089588356f2' :: uuid,
		NOW (),
		NOW ()
	),
	(
		'9666740a-4ff5-4d22-830f-ab3361ba5ef4' :: uuid,
		'user',
		4194304,
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
		'cc203bb9-7b33-4391-8917-0089588356f2' :: uuid,
		16777216
	),
	(
		'cc203bb9-7b33-4391-8917-0089588356f2' :: uuid,
		33554432
	),
	(
		'cc203bb9-7b33-4391-8917-0089588356f2' :: uuid,
		67108864
	),
	(
		'cc203bb9-7b33-4391-8917-0089588356f2' :: uuid,
		134217728
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
		'6c8647dc-091f-4249-b9f7-12bed594d124' :: uuid,
		16777216
	),
	(
		'9666740a-4ff5-4d22-830f-ab3361ba5ef4' :: uuid,
		4194304
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
		'$2a$10$sZxiPLqCjWpft0qcWhiscu5uxvbUD.Tlx3ZrzIX1ywwU1ghAr3hUW',
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
		'$2a$10$7iWYtkc2ohSfcGJ6zIIJ9u.7qFKo8N.3uwrdEU7knndQrUZMsyAhe',
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
		'OTP Verification - Verity Email',
		'<!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8" /> <meta name="viewport" content="width=device-width, initial-scale=1.0" /> <title>OTP Verification - {{.CompanyName}}</title> <style> body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; } .email-container { max-width: 600px; margin: 30px auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 15px rgba(0, 0, 0, 0.1); } .email-header { text-align: center; padding-bottom: 20px; } .email-header h1 { font-size: 24px; color: #333333; margin: 0; } .otp-container { text-align: center; padding: 20px; background-color: #f8f8f8; border-radius: 5px; margin-top: 20px; } .otp-code { font-size: 32px; font-weight: bold; color: #007bff; margin: 0; } .email-footer { text-align: center; padding-top: 20px; color: #777777; font-size: 14px; } .email-footer a { color: #007bff; text-decoration: none; } </style> </head> <body> <div class="email-container"> <div class="email-header"> <h1>OTP Verification Code</h1> </div> <p>Hi {{.Name}},</p> <p> We received a request to verify your identity. Use the One-Time Password (OTP) below to complete the process: </p> <div class="otp-container"> <p class="otp-code">{{.OTPCode}}</p> </div> <p> This OTP is valid for {{.Expire}}. If you did not request this, please ignore this email. </p> <div class="email-footer"> <p>Best regards,</p> <p>The {{.CompanyName}} Team</p> <p>&copy; 2024 Sport Booking. All rights reserved.</p> </div> </div> </body> </html>',
		'verify email',
		NOW(),
		NOW()
	),
	(
		gen_random_uuid(),
		'A:RP:',
		'OTP Verification - Reset Your Password',
		'<!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8" /> <meta name="viewport" content="width=device-width, initial-scale=1.0" /> <title>OTP Verification - {{.CompanyName}}</title> <style> body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; } .email-container { max-width: 600px; margin: 30px auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 15px rgba(0, 0, 0, 0.1); } .email-header { text-align: center; padding-bottom: 20px; } .email-header h1 { font-size: 24px; color: #333333; margin: 0; } .otp-container { text-align: center; padding: 20px; background-color: #f8f8f8; border-radius: 5px; margin-top: 20px; } .otp-code { font-size: 32px; font-weight: bold; color: #007bff; margin: 0; } .email-footer { text-align: center; padding-top: 20px; color: #777777; font-size: 14px; } .email-footer a { color: #007bff; text-decoration: none; } </style> </head> <body> <div class="email-container"> <div class="email-header"> <h1>OTP Verification Code</h1> </div> <p>Hi {{.Name}},</p> <p> We received a request to verify your identity. Use the One-Time Password (OTP) below to complete the process: </p> <div class="otp-container"> <p class="otp-code">{{.OTPCode}}</p> </div> <p> This OTP is valid for {{.Expire}}. If you did not request this, please ignore this email. </p> <div class="email-footer"> <p>Best regards,</p> <p>The {{.CompanyName}} Team</p> <p>&copy; 2024 Sport Booking. All rights reserved.</p> </div> </div> </body> </html>',
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
