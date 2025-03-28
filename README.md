# TODO

- [x] deploy
- [x] make basic UI with mock data
- [x] setup auth
- [x] make db schema
- [x] make queries
- [x] can't press AddButton component when it is in [...route]/layout.tsx.
- [x] make sure that only certain files can be uploaded.
- [x] need to make sure that all objects are unique name so just bcrypt name of it it will become unique
- [x] setup S3
- [x] for folder submit the route comes from other file shows up as string. Handle that
- [x] make query for add folder
- [x] make query for adding file info
- [x] deleted bucket create a new one and pull that from .env to db pushing part
- [x] after testing add schema and queries userId
- [x] make sure that all works with UI
- [x] put some files to S3 and test UI
- [x] take a look at buttons it creates hydration errors
- [x] fix card behaviour
- [x] on prod neon db causing issues probably about env.
- [x] make delete button
- [x] delete button is functioning but somehow it doesn't delete from s3 need to look at that.
- [ ] make share button fully functioning
- [ ] make sure that when uploading something make it reload (after you make cache make it revalidate)
- [ ] look for how to show users pdf or excel files
- [x] make sure that uploading will be at client side not on server
- [ ] make it shareable if user wants
- [ ] if elements on breadcrumb more than 4 show other elements in "..." dropdown element

## NOTES

- for security when you are sending name of the file to aws also make sure that you encrypt the userId and add that to name of file when uploading the file.
- if a person presses share button lets add a switch for sharable for that so if user switches that nobody can look at it
    - we will achive this by url based search when a user presses a file first it will go to our site that it will get it's real url and than will go to file.
- share link will be route of file
- Copy button doesn't functioning propperly (after connecting with S3 this will be contain link we want)
- drawer.tsx might give error because DialogTitle.
- Rather than breadcrumb you can use side bar with scroll area so you don't have to worry about size of route
