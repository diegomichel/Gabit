/**
 * Created with PyCharm.
 * User: diego
 * Date: 21/06/13
 * Time: 07:13 PM
 * To change this template use File | Settings | File Templates.
 */
function alerta(output_msg, title_msg)
{
    if (!title_msg)
        title_msg = 'Alerta';

    if (!output_msg)
        output_msg = 'No Message to Display.';

    $("<div></div>").html("<center>"+output_msg+"</center>").dialog({
        title: title_msg,
        resizable: false,
        modal: true,
        show: {
            effect: "explode",
            duration: 1000
        },
        hide: {
            effect: "explode",
            duration: 1000
        },
        buttons: {
            "Ok": function()
            {
                $( this ).dialog( "close" );
            }
        }
    });
}