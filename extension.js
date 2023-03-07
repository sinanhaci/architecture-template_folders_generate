const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

function activate(context) {
	let disposable = vscode.commands.registerCommand('sinanhacia.createMVVM', function (uri) {
		let folderPath = uri.fsPath;
		vscode.window.showInputBox({
			placeHolder: "Enter a name for the MVVM folders",
			value: "enter_folder_name"
		}).then(function (folderName) {
			createMVVM(folderPath, folderName);
		});
	});
	let disposableService = vscode.commands.registerCommand('sinanhacia.createMVVMWithService', function (uri) {
		let folderPath = uri.fsPath;
		vscode.window.showInputBox({
			placeHolder: "Enter a name for the MVVM folders",
			value: "enter_folder_name"
		}).then(function (folderName) {
			createMVVMWithService(folderPath, folderName);
		});
	});
	context.subscriptions.push(disposable);
	context.subscriptions.push(disposableService);

}


function createMVVM(folderPath, folderName) {
	// Create the MVVM folders
	fs.mkdirSync(path.join(folderPath, folderName));
	fs.mkdirSync(path.join(folderPath, folderName, 'model'));
	fs.mkdirSync(path.join(folderPath, folderName, 'view'));
	fs.mkdirSync(path.join(folderPath, folderName, 'viewmodel'));
	var subFolderPath = folderPath +"/"+ folderName + "/";
	// Create the MVVM files
	fs.writeFileSync(path.join(subFolderPath, 'model', `${folderName}_model.dart`), generateModelClass(folderName));
	fs.writeFileSync(path.join(subFolderPath, 'view', `${folderName}_view.dart`), generateVievClass(folderName));
	fs.writeFileSync(path.join(subFolderPath, 'viewmodel', `${folderName}_viewmodel.dart`),  generateViewModelClass(folderName));
}

function createMVVMWithService(folderPath, folderName) {
	// Create the MVVM folders
	fs.mkdirSync(path.join(folderPath, folderName));
	fs.mkdirSync(path.join(folderPath, folderName, 'model'));
	fs.mkdirSync(path.join(folderPath, folderName, 'view'));
	fs.mkdirSync(path.join(folderPath, folderName, 'viewmodel'));
	fs.mkdirSync(path.join(folderPath, folderName, 'service'));

	var subFolderPath = folderPath +"/"+ folderName + "/";
	// Create the MVVM files
	fs.writeFileSync(path.join(subFolderPath, 'model', `${folderName}_model.dart`), generateModelClass(folderName));
	fs.writeFileSync(path.join(subFolderPath, 'view', `${folderName}_view.dart`), generateVievClass(folderName));
	fs.writeFileSync(path.join(subFolderPath, 'viewmodel', `${folderName}_viewmodel.dart`),  generateViewModelClassWithService(folderName));
	fs.writeFileSync(path.join(subFolderPath, 'service', `${folderName}_service.dart`),  generateServiceClass(folderName));

}

function generateVievClass (folderName){
	return `
	
import '../viewmodel/${folderName}_viewmodel.dart';
import '/export.dart';


class ${toPascalCase(folderName)}View extends StatelessWidget {
  const ${toPascalCase(folderName)}View({super.key});

  @override
  Widget build(BuildContext context) {
	return BaseView<${toPascalCase(folderName)}ViewModel>(
	  viewModel: ${toPascalCase(folderName)}ViewModel(),
	  onLoggerKey: PageLoggerKeys.${toPascalCase(folderName)},
	  onInit: (controller) {
		controller.setContext(context);
		controller.init();
	  },
	  onDispose: (controller) {
		controller.dispose();
	  },
	  onView: (context, controller) {
		return const Scaffold(
		  body: Center(
			child: Text("${toPascalCase(folderName)}"),
		  ),
		);
	  },
	);
  }
}`;  
}

function generateViewModelClass (folderName){
	return `
import 'package:mobx/mobx.dart';
import '/export.dart';
part '${folderName}_viewmodel.g.dart';

class ${toPascalCase(folderName)}ViewModel = _${toPascalCase(folderName)}ViewModelBase with _$${toPascalCase(folderName)}ViewModel;

abstract class _${toPascalCase(folderName)}ViewModelBase extends BaseRequestMethod with Store, BaseViewModel {
  
  @override
  void setContext(BuildContext context) {
	context = context;
	theme = Theme.of(context);
	size = MediaQuery.of(context).size;
  }

  @override
  void init() {}

  @override
  void dispose() {}

}`;
}

function generateViewModelClassWithService (folderName){
	return `
import 'package:mobx/mobx.dart';
import '/export.dart';
import '../service/${folderName}_service.dart';
part '${folderName}_viewmodel.g.dart';

class ${toPascalCase(folderName)}ViewModel = _${toPascalCase(folderName)}ViewModelBase with _$${toPascalCase(folderName)}ViewModel;

abstract class _${toPascalCase(folderName)}ViewModelBase extends ${toPascalCase(folderName)}Service with Store, BaseViewModel {
  
  @override
  void setContext(BuildContext context) {
	context = context;
	theme = Theme.of(context);
	size = MediaQuery.of(context).size;
  }

  @override
  void init() {}

  @override
  void dispose() {}

}`;
}

function generateServiceClass (folderName){
	return `
import '/export.dart';

class ${toPascalCase(folderName)}Service extends BaseRequestMethod {


}`;
}

function generateModelClass (folderName){
	return `
class ${toPascalCase(folderName)}Model {

}`;
}


function toCamelCase(str) {
	return str.split('_')
	  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
	  .join('');
  }
  
  function toPascalCase(str) {
	const camelCase = toCamelCase(str);
	return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
  }

function deactivate() {}

module.exports = {
	activate,
	deactivate
};
