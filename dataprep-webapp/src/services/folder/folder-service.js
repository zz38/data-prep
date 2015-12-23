(function () {
  'use strict';

  /**
   * @ngdoc service
   * @name data-prep.services.folder.service:FolderService
   * @description Folder service. This service provide the entry point to the Folder service.
   * @requires data-prep.services.state.constant:state
   * @requires data-prep.services.folder.service:FolderRestService
   * @requires data-prep.services.state.service:StateService
   * @requires data-prep.services.dataset.service:DatasetListSortService
   * @requires data-prep.services.preparation.service:PreparationListService
   */
  function FolderService (state, FolderRestService, StateService, DatasetListSortService, $translate, PreparationListService) {

    return {
      // folder operations
      create: createFolder,
      renameFolder: renameFolder,
      removeFolder: removeFolder,
      getFolderContent: getFolderContent,
      refreshDefaultPreparationForCurrentFolder: refreshDefaultPreparationForCurrentFolder,
      children: children,
      searchFolders: searchFolders,

      // shared folder ui mngt
      populateMenuChildren: populateMenuChildren
    };

    //----------------------------------------------
    //   folders
    //----------------------------------------------


    /**
     * @ngdoc method
     * @name children
     * @methodOf data-prep.services.folder.service:FolderService
     * @description Get children of a folder
     * @param {string} path the path to get children
     * @returns {Promise} The GET promise
     */
    function children(path){
      return FolderRestService.children(path);
    }

    /**
     * @ngdoc method
     * @name createFolder
     * @methodOf data-prep.services.folder.service:FolderService
     * @description Create a folder
     * @param {string} path the path to create
     * @returns {Promise} The PUT promise
     */
    function createFolder (path) {
      return FolderRestService.create(path);
    }

    /**
     * @ngdoc method
     * @name searchFolders
     * @methodOf data-prep.services.folder.service:FolderService
     * @description Search folders with a part of the name
     * @param {string} query the part of the name to search
     * @returns {Promise} The GET promise
     */
    function searchFolders (path) {
      return FolderRestService.searchFolders(path);
    }

    /**
     * @ngdoc method
     * @name renameFolder
     * @methodOf data-prep.services.folder.service:FolderService
     * @description Rename a folder
     * @param {string} path the path to rename
     * @param {string} newPath the new path
     * @returns {Promise} The PUT promise
     */
    function renameFolder (path, newPath) {
      return FolderRestService.renameFolder(path, newPath);
    }

    /**
     * @ngdoc method
     * @name removeFolder
     * @methodOf data-prep.services.folder.service:FolderService
     * @description Remove a folder
     * @param {string} path the path to remove
     * @returns {Promise} The DELETE promise
     */
    function removeFolder (path) {
      return FolderRestService.removeFolder(path);
    }


    //----------------------------------------------
    //   shared ui management
    //----------------------------------------------

    /**
     * @ngdoc method
     * @name buildStackFromId
     * @methodOf data-prep.services.folder.service:FolderService
     * @description build the folder stack from the the given id
     * @param {string} the folder id
     */
    function buildStackFromId (folderId) {

      var foldersStack = [];
      foldersStack.push({id: '', path: '', name: $translate.instant('HOME_FOLDER')});

      if (folderId) {
        var paths = folderId.split('/');
        for (var i = 1; i <= paths.length + 1; i++) {
          if (paths[i - 1]) {
            if (i > 1) {
              foldersStack.push({
                                  id: foldersStack[i - 1].id + '/' + paths[i - 1],
                                  path: foldersStack[i - 1].id + '/' + paths[i - 1],
                                  name: paths[i - 1]
                                });
            } else {
              foldersStack.push({id: paths[i - 1], path: paths[i - 1], name: paths[i - 1]});
            }
          }
        }
      }

      StateService.setFoldersStack(foldersStack);
    }

    /**
     * @ngdoc method
     * @name populateMenuChildren
     * @methodOf data-prep.folder.controller:FolderCtrl
     * @description build the children of the part part given by the index parameter
     */
    function populateMenuChildren(folder) {
      return FolderRestService.getFolderContent(folder)
          .then(function (content) {
            StateService.setMenuChildren(content.data.folders);
          });
    }

    /**
     * @ngdoc method
     * @name consolidatePreparationsAndDatasetsForCurrentFolder
     * @methodOf data-prep.folder.controller:FolderCtrl
     */
    function refreshDefaultPreparationForCurrentFolder (preparations) {
      // group preparation per dataset
      var datasetPreps = _.groupBy(preparations, function (preparation) {
        return preparation.dataSetId;
      });

      // reset default preparation for all datasets
      _.forEach(state.folder.currentFolderContent.datasets, function (dataset) {
        var preparations           = datasetPreps[dataset.id];
        dataset.defaultPreparation = preparations && preparations.length === 1 ? preparations[0] : null;
      });

      return preparations;
    }

    /**
     * @ngdoc method
     * @name goToFolder
     * @methodOf data-prep.folder.controller:FolderCtrl
     * @param {object} folder - the folder to go
     */
    function getFolderContent (folder) {

      var sort    = DatasetListSortService.getSort();
      var order   = DatasetListSortService.getOrder();
      var promise = FolderRestService.getFolderContent(folder, sort, order);

      promise.then(function (content) {

        var contentData = content.data;
        //Consolidate preparations and datasets
        PreparationListService.getPreparationsPromise()
            .then(function (preparations) {

              // group preparation per dataset
              var datasetPreps = _.groupBy(preparations, function (preparation) {
                return preparation.dataSetId;
              });

              // reset default preparation for all datasets
              _.forEach(contentData.datasets, function (dataset) {
                var preparations           = datasetPreps[dataset.id];
                dataset.defaultPreparation = preparations && preparations.length === 1 ? preparations[0] : null;
              });

              return contentData;
            })
            .then(function (contentData) {
              StateService.setCurrentFolder(folder ? folder : {
                id: '',
                path: '',
                name: $translate.instant('HOME_FOLDER')
              });
              StateService.setCurrentFolderContent(contentData);
              buildStackFromId(folder ? folder.id : '');
            });
      });
      return promise;
    }

  }

  angular.module('data-prep.services.folder')
      .service('FolderService', FolderService);
})();