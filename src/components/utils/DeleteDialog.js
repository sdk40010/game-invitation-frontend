import {
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
    DialogContentText,
    Button
} from "@material-ui/core";

/**
 * 削除の確認をするダイアログ
 */
export default function DeleteDialog(props) {
    const { open, itemName, onClose, onDelete } = props;

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>削除の確認</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {`${itemName}を削除しますか？`}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={onClose}>キャンセル</Button>
                <Button variant="contained" color="primary" onClick={onDelete}>削除</Button>
            </DialogActions>
        </Dialog>
    );
}