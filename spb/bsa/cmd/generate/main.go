package generate

import (
	_ "embed"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"text/template"

	"github.com/iancoleman/strcase"
)

type entity struct {
	PathName         string
	ModuleName       string // name of module
	StructName       string // just Uppercase 1st char
	StructNamePlural string // the plural of the new module
	ModuleNamePlural string
	RouteName        string
	Path             string
}

// @author: LoanTT
// @function: GenerateNewModule
// @description: Generate new module
// @param: string
// @return: error
func GenerateNewModule(moduleName string) {
	newModule := getNewModuleStruct(moduleName)
	fmt.Printf("Generate new module %+v\n", newModule)

	/* create tries */
	if err := os.Mkdir(newModule.Path, 0o750); err != nil {
		fmt.Println("err:", err)
	}
	if err := os.Mkdir(newModule.Path+"/handler", 0o750); err != nil {
		fmt.Println("err:", err)
	}
	if err := os.Mkdir(newModule.Path+"/model", 0o750); err != nil {
		fmt.Println("err:", err)
	}
	if err := os.Mkdir(newModule.Path+"/service", 0o750); err != nil {
		fmt.Println("err:", err)
	}
	if err := os.Mkdir(newModule.Path+"/utility", 0o750); err != nil {
		fmt.Println("err:", err)
	}

	// create module file
	fmt.Printf("\n>> CREATED FOLDER: %s\n", newModule.Path)
	newModule.createFile(moduleTemplate, newModule.Path+"/module.go")
	// create handler files
	fmt.Printf("\n>> CREATED FOLDER: %s\n", newModule.Path+"/handler")
	newModule.createFile(getAllHandlerTemplate, newModule.Path+"/handler/get_all_handler.go")
	newModule.createFile(getByidHandlerTemplate, newModule.Path+"/handler/get_byid_handler.go")
	newModule.createFile(createHandlerTemplate, newModule.Path+"/handler/create_handler.go")
	newModule.createFile(updateHandlerTemplate, newModule.Path+"/handler/update_handler.go")
	newModule.createFile(deleteHandlerTemplate, newModule.Path+"/handler/delete_handler.go")
	newModule.createFile(handlerTemplate, newModule.Path+"/handler/handler.go")
	// create service files
	fmt.Printf("\n>> CREATED FOLDER: %s\n", newModule.Path+"/service")
	newModule.createFile(getAllServiceTemplate, newModule.Path+"/service/get_all_service.go")
	newModule.createFile(getByidServiceTemplate, newModule.Path+"/service/get_byid_service.go")
	newModule.createFile(createServiceTemplate, newModule.Path+"/service/create_service.go")
	newModule.createFile(updateServiceTemplate, newModule.Path+"/service/update_service.go")
	newModule.createFile(deleteServiceTemplate, newModule.Path+"/service/delete_service.go")
	newModule.createFile(serviceTemplate, newModule.Path+"/service/service.go")
	// create model file
	fmt.Printf("\n>> CREATED FOLDER: %s\n", newModule.Path+"/model")
	newModule.createFile(modelTemplate, newModule.Path+"/model/model.go")
	// create utility file
	fmt.Printf("\n>> CREATED FOLDER: %s\n", newModule.Path+"/utility")
	newModule.createFile(utilityTemplate, newModule.Path+"/utility/utility.go")
}

// @author: LoanTT
// @function: getNewModuleStruct
// @description: get new module struct
// @param: string
// @return: *entity
func getNewModuleStruct(inputName string) *entity {
	var (
		pathName        string = inputName
		moduleName      string = strcase.ToLowerCamel(inputName)
		structName      string = strcase.ToCamel(inputName)
		plural          string = Pluralfy(structName)
		routeName       string = strcase.ToKebab(plural)
		inputNamePlural string = Pluralfy(inputName)
	)

	newDirectory := fmt.Sprintf("internal/%s", inputName)
	newModule := &entity{pathName, moduleName, structName, plural, inputNamePlural, routeName, newDirectory}
	return newModule
}

// @author: LoanTT
// @function: Pluralfy
// @description: Pluralfy
// @param: string
// @return: string
func Pluralfy(word string) (plural string) {
	switch word[len(word)-1:] {
	case "y":
		plural = word[0:len(word)-1] + "ies"
	case "s":
		plural = word + "es"
	default:
		plural = word + "s"
	}
	return plural
}

// @author: LoanTT
// @function: createFile
// @description: create file
// @param: string
// @param: string
func (e *entity) createFile(templateFile, filePath string) {
	file, err := os.Create(filepath.Clean(filePath))
	if err != nil {
		log.Printf("create %s failed: %s\n", filePath, err)
		return
	}

	t := template.Must(template.New(filePath).Parse(templateFile))
	if err := t.Execute(file, e); err != nil {
		log.Printf("create %s failed: %s\n", filePath, err)
	}

	fmt.Printf("   + CREATED FILES: %s\n", filePath)
}

// handler

//go:embed skel/get_all_handler.tmpl
var getAllHandlerTemplate string

//go:embed skel/get_byid_handler.tmpl
var getByidHandlerTemplate string

//go:embed skel/create_handler.tmpl
var createHandlerTemplate string

//go:embed skel/update_handler.tmpl
var updateHandlerTemplate string

//go:embed skel/delete_handler.tmpl
var deleteHandlerTemplate string

//go:embed skel/handler.tmpl
var handlerTemplate string

// service

//go:embed skel/get_all_service.tmpl
var getAllServiceTemplate string

//go:embed skel/get_byid_service.tmpl
var getByidServiceTemplate string

//go:embed skel/create_service.tmpl
var createServiceTemplate string

//go:embed skel/update_service.tmpl
var updateServiceTemplate string

//go:embed skel/delete_service.tmpl
var deleteServiceTemplate string

//go:embed skel/service.tmpl
var serviceTemplate string

// model

//go:embed skel/model.tmpl
var modelTemplate string

// utility

//go:embed skel/utility.tmpl
var utilityTemplate string

// module

//go:embed skel/module.tmpl
var moduleTemplate string
