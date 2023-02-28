using System.Collections.Generic;
using UnityEditor;
using UnityEditor.PackageManager;
using UnityEngine;

public class ZepetoImportManager : EditorWindow
{
    [MenuItem("ZEPETO/ImportManager")]
    public static void ShowWindow()
    {
        //Show existing window instance. If one doesn't exist, make one.
        EditorWindow.GetWindow(typeof(ZepetoImportManager));
    }
    
    void OnGUI()
    {
        GUILayout.Label ("ZepetoImportManager", EditorStyles.boldLabel);
        
        string assetPath = Application.dataPath;
        string jsonString = System.IO.File.ReadAllText(assetPath+"/ZepetoImporter/Data/urlPath.json");
        ItemArray dataUrlArray = JsonUtility.FromJson<ItemArray>(jsonString);
            
        foreach (MyData data in dataUrlArray.Items)
        {
            GUILayout.BeginHorizontal();
            GUILayout.Label(data.Title, GUILayout.Width(100), GUILayout.ExpandWidth(true));
            GUILayout.FlexibleSpace();
            if (GUILayout.Button("Docs",GUILayout.Width(80), GUILayout.ExpandWidth(false)))
            {    
                string url = data.DocsUrl;
                Application.OpenURL(url);
            }
            if (GUILayout.Button("Download",GUILayout.Width(80), GUILayout.ExpandWidth(false)))
            {    
                //string url = data.DownloadUrl;
                string url = "https://github.com/JasperGame/zepeto-teamutility.git";
                Client.Add(url);
            }
            GUILayout.EndHorizontal();
        }
    }
    
    [System.Serializable]
    public class MyData
    {
        public string Title;
        public string DocsUrl;
        public string DownloadUrl;
    }
    
    [System.Serializable]
    public class ItemArray
    {
        public List<MyData> Items;
    }
    
}
