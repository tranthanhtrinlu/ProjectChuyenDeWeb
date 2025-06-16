package vn.trijava.springrest.domain.response;

public class IBackendRes<T> {
    private int status;
    private String message;
    private T data;

    // Constructors
    public IBackendRes() {
    }

    public IBackendRes(int status, String message, T data) {
        this.status = status;
        this.message = message;
        this.data = data;
    }

    // Getters and Setters
    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }
}